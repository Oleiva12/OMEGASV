const axios = require('axios');

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.processInventory = async (event, context) => {
  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : 'No message';

  console.log('Received message:', message);

  try {
    const apiUrl = 'https://inventario-app-2gjixdocha-uc.a.run.app/api/mock-data';

    const response = await axios.get(apiUrl);

    const inventoryData = response.data;
    console.log('Inventory Data:', inventoryData);

    // Inicializamos las estructuras de datos
    const result = {};

    inventoryData.forEach(item => {
      const producto = item.descripcion;
      const cantidad = parseFloat(item.cantidad);
      const precio = parseFloat(item.precio_compra);
      const sucursal = item.sucursal;

      if (isNaN(cantidad) || isNaN(precio)) {
        console.warn(`Datos inválidos para el producto ${producto}: cantidad (${item.cantidad}), precio (${item.precio_compra})`);
        return;
      }

      // Aseguramos que existan las estructuras necesarias
      if (!result[producto]) {
        result[producto] = {
          stockBySucursal: {},
          totalSalesBySucursal: {},
          totalPurchasedQuantityBySucursal: {},
          totalSoldQuantityBySucursal: {},
          totalProductCostBySucursal: {},
          currentStockValueBySucursal: {}
        };
      }

      if (!result[producto].stockBySucursal[sucursal]) {
        result[producto].stockBySucursal[sucursal] = 0;
        result[producto].totalSalesBySucursal[sucursal] = 0;
        result[producto].totalPurchasedQuantityBySucursal[sucursal] = 0;
        result[producto].totalSoldQuantityBySucursal[sucursal] = 0;
        result[producto].totalProductCostBySucursal[sucursal] = 0;
        result[producto].currentStockValueBySucursal[sucursal] = 0;
      }

      if (item.tipo_movimiento === 'entrada') {
        // Aumenta el stock y el costo total de producto comprado
        result[producto].stockBySucursal[sucursal] += cantidad;
        result[producto].totalProductCostBySucursal[sucursal] += cantidad * precio;
        result[producto].totalPurchasedQuantityBySucursal[sucursal] += cantidad;
      } else if (item.tipo_movimiento === 'salida') {
        // Reduce el stock y calcula las ventas
        result[producto].stockBySucursal[sucursal] -= cantidad;
        result[producto].totalSalesBySucursal[sucursal] += cantidad * precio;
        result[producto].totalSoldQuantityBySucursal[sucursal] += cantidad;
      }
    });

    // Prepara los datos para BigQuery
    const bigQueryData = [];

    Object.keys(result).forEach(producto => {
      Object.keys(result[producto].stockBySucursal).forEach(sucursal => {
        bigQueryData.push({
          producto,
          sucursal,
          stock_disponible: result[producto].stockBySucursal[sucursal],
          cantidad_comprada: result[producto].totalPurchasedQuantityBySucursal[sucursal],
          cantidad_vendida: result[producto].totalSoldQuantityBySucursal[sucursal],
          ventas_totales: result[producto].totalSalesBySucursal[sucursal],
          costo_producto_comprado: result[producto].totalProductCostBySucursal[sucursal],
          valor_stock_actual: result[producto].stockBySucursal[sucursal] * (result[producto].totalProductCostBySucursal[sucursal] / result[producto].totalPurchasedQuantityBySucursal[sucursal] || 0)
        });
      });
    });

    // Imprime los datos en el formato adecuado para BigQuery
    console.log('Datos para BigQuery:', JSON.stringify(bigQueryData, null, 2));

  } catch (error) {
    console.error('Error al obtener o procesar los datos del inventario:', error);
  }
};
