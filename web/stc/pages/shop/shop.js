function addToCart(productId) {
    const productName = document.getElementById(`product-name-${productId}`).innerText;
    const productPrice = document.getElementById(`product-price-${productId}`).innerText.replace('Цена: ', '').replace(' руб.', '');
    const productImageUrl = document.getElementById(`product-img-${productId}`).src;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(product => product.id === productId);

    console.log(productImageUrl);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1,
            image_url: productImageUrl
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = event.target.getAttribute("data-id");
        addToCart(productId);
    }
});

document.addEventListener("DOMContentLoaded", async function() {
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/controllers/get-products');
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Неизвестная ошибка');
            }
    
            const products = data.products || [];
    
            const productsList = document.querySelector('.main_list_products');
            productsList.innerHTML = ''; 

            products.forEach(product => {
                const productElement = document.createElement('li');
                productElement.innerHTML = `
                    <div class="product_div1">
                        <p class="product_header" id="product-name-${product.id}">${product.name}</p>
                        <div class="product_div2">
                            <img class="product_img"  id="product-img-${product.id}" 
                                src="/web/img/${product.image_url}" 
                                alt="${product.name}">
                            <p class="product_stock" id="product-stock-${product.id}">Наличие: ${product.quantity}</p>
                            <p class="product_description" id="product-price-${product.id}">Цена: ${product.price} руб.</p>
                            <button type="click" class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                        </div>
                    </div>
                `;
                productsList.appendChild(productElement);
            });
            
            
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            alert('Не удалось загрузить товары.');
        }
    }    

    fetchProducts();
});