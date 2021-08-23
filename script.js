const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cart = document.querySelector('.cart__items');

let totalPrice = 0;

function priceTotal(price) {
  const total = document.querySelector('.total-price');
  totalPrice = Number(total.innerText);
  totalPrice += price;
  total.innerText = totalPrice;
}

function ItemSku(sku) {
  return sku.split(' ')[1];
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.removeItem(ItemSku(event.target.innerText));

  const value = event.target.innerText.split('$')[1];
  priceTotal(-value);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  priceTotal(salePrice);
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function addCartItem(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const item = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const itemJson = await item.json();
  const { id: sku, title: name, price: salePrice } = itemJson;
  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
  localStorage.setItem(sku, JSON.stringify(itemJson));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const addItems = document.querySelectorAll('.item__add');
  addItems.forEach((button) => {
    button.addEventListener('click', addCartItem);
  });

  return section;
}

async function requestAPI(url) {
  const loading = document.querySelector('.items');
  const load = document.createElement('span');
  load.className = 'loading';
  load.innerText = 'loading...';
  loading.appendChild(load);
  const response = await fetch(url);
  const json = await response.json();
  const items = json.results;
  items.map((ci) => {
    const listItems = document.querySelector('.items');
    const propsProcusct = { sku: ci.id, name: ci.title, price: ci.price, image: ci.thumbnail };
    const product = createProductItemElement(propsProcusct);
    listItems.appendChild(product);
    return listItems;
  });
  load.remove();
}

function removeCart() {
  const items = document.querySelector('.cart__items');
  while (items.firstChild) {
    items.removeChild(items.lastChild);
  }
  const price = document.querySelector('.total-price');
  price.innerHTML = 0;
}

function loadItemsFromStorage() {
  Object.keys(localStorage).forEach((key) => {
    const item = JSON.parse(localStorage.getItem(key));
    const { id: sku, title: name, price: salePrice } = item;

    cart.appendChild(createCartItemElement({ sku, name, salePrice }));
  });
}

window.onload = () => {
  requestAPI(urlAPI);
  loadItemsFromStorage();
  const removeCartButton = document.querySelector('.empty-cart');
  removeCartButton.addEventListener('click', removeCart);
};
