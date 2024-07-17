import { addPrice } from './adminPrices/addPrices.js';
import { deletePrice } from './adminPrices/deletePrices.js';
import { getPrices } from './adminPrices/getPrices.js';
import { updatePrice } from './adminPrices/updatePrices.js';

document.addEventListener('DOMContentLoaded', function () {
  const getPricesContainer = document.getElementById('getPricesContainer');
  const newPriceContainer = document.getElementById('newPriceContainer');
  const updatePriceContainer = document.getElementById('updatePriceContainer');
  const deletePriceContainer = document.getElementById('deletePriceContainer');

  document.getElementById('showGetPrices').addEventListener('click', function () {
    getPricesContainer.style.display = 'block';
    newPriceContainer.style.display = 'none';
    updatePriceContainer.style.display = 'none';
    deletePriceContainer.style.display = 'none';

    getPrices();
  });

  document.getElementById('showNewPrice').addEventListener('click', function () {
    getPricesContainer.style.display = 'none';
    newPriceContainer.style.display = 'block';
    updatePriceContainer.style.display = 'none';
    deletePriceContainer.style.display = 'none';

    addPrice();
  });

  document.getElementById('showUpdatePrice').addEventListener('click', function () {
    getPricesContainer.style.display = 'none';
    newPriceContainer.style.display = 'none';
    updatePriceContainer.style.display = 'block';
    deletePriceContainer.style.display = 'none';

    updatePrice();
  });

  document.getElementById('showDeletePrice').addEventListener('click', function () {
    getPricesContainer.style.display = 'none';
    newPriceContainer.style.display = 'none';
    updatePriceContainer.style.display = 'none';
    deletePriceContainer.style.display = 'block';

    deletePrice();
  });
});
