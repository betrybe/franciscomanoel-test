const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestAPI(url) {
  const response = await fetch(url);
  const json = await response.json();
  const items = json.results;
  
  items.map((ci) => {
    const listItems = document.querySelector('.items');
    return listItems.appendChild(
      createProductItemElement(
        { sku: ci.id, name: ci.title, price: ci.price, image: ci.thumbnail },
        ),
        );
  });
}

async function addCartItem(event) {
   const itemId = getSkuFromProductItem(event.target.parentNode);
   
  const item = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const itemJson = await item.json();

  const {
    id: sku, title: name, price: salePrice,
  } = itemJson;
    
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement({
    sku, name, salePrice,
  }));
}

function removeCart() {
  const items = document.querySelector('.cart__items');
  while (items.firstChild) {
    items.removeChild(items.lastChild);
  }
}

window.onload = () => {
  requestAPI(urlAPI);

  const removeCartButton = document.querySelector('.empty-cart');
  removeCartButton.addEventListener('click', removeCart);
};
