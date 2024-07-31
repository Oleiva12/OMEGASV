const { PubSub } = require('@google-cloud/pubsub');
const { BigQuery } = require('@google-cloud/bigquery');
const axios = require('axios');

// Configura el cliente de Pub/Sub y BigQuery
const pubsub = new PubSub({ projectId: 'proyecto-1-430616' });
const bigquery = new BigQuery({ projectId: 'proyecto-1-430616' });

const topicName = 'data-transfer-topic'; // Reemplaza con el nombre de tu tópico de salida
const datasetId = 'inventario'; // Reemplaza con tu ID de dataset
const tableId = 'inventario_data'; // Reemplaza con tu ID de tabla

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
        result[producto].stockBySucursal[sucursal] += cantidad;
        result[producto].totalProductCostBySucursal[sucursal] += cantidad * precio;
        result[producto].totalPurchasedQuantityBySucursal[sucursal] += cantidad;
      } else if (item.tipo_movimiento === 'salida') {
        result[producto].stockBySucursal[sucursal] -= cantidad;
        result[producto].totalSalesBySucursal[sucursal] += cantidad * precio;
        result[producto].totalSoldQuantityBySucursal[sucursal] += cantidad;
      }
    });

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

    console.log('Datos para BigQuery:', JSON.stringify(bigQueryData, null, 2));

    // Insertar datos en BigQuery
    await bigquery
      .dataset(datasetId)
      .table(tableId)
      .insert(bigQueryData);

    console.log('Datos insertados en BigQuery');

    // Publicar resultados a un tópico de Pub/Sub
    const dataBuffer = Buffer.from(JSON.stringify(bigQueryData));
    await pubsub.topic(topicName).publishMessage({ data: dataBuffer });

    console.log('Datos publicados al tópico de salida:', topicName);

  } catch (error) {
    console.error('Error al obtener o procesar los datos del inventario:', error);
  }
};
