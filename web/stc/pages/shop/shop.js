function addToCart(productId) {
    const productName = document.getElementById(`product-name-${productId}`).innerText;
    const productPrice = document.getElementById(`product-price-${productId}`).innerText.replace('Цена: ', '').replace(' руб.', '');
    const productImageUrl = document.getElementById(`product-img-${productId}`).src;
    const productQuantity = parseInt(document.getElementById(`product-stock-${productId}`).innerText.replace('Наличие: ', ''));

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(product => product.id === productId);

    if (existingProduct) {
        if (existingProduct.quantity < productQuantity) {
            existingProduct.quantity += 1;
        } else {
            alert(`Невозможно добавить больше ${productQuantity} единиц этого товара в корзину.`);
            return;
        }
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

document.addEventListener("DOMContentLoaded", async function () {
    const searchInput = document.querySelector(".search_input");
    const productsList = document.querySelector('.main_list_products');
    const sortSelect = document.querySelector(".sort_select");

    let productsData = [];

    try {
        const response = await fetch('http://localhost:3000/controllers/get-products');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Неизвестная ошибка');
        }

        productsData = data.products || []; 
        fetchProducts(productsData);
    } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
    }

    function fetchProducts(products) {
        if (!products || !Array.isArray(products)) {
            console.error("Некорректные данные для отображения товаров.");
            return;
        }

        productsList.innerHTML = '';

        const availableProducts = products.filter(product => product.quantity > 0);

        availableProducts.forEach(product => {
            const productElement = document.createElement('li');
            productElement.innerHTML = `
                <div class="product_div1">
                    <p class="product_header" id="product-name-${product.id}">${product.name}</p>
                    <div class="product_div2">
                        <img class="product_img" id="product-img-${product.id}" 
                            src="/web/img/${product.image_url}" 
                            alt="${product.name}">
                        <p class="product_stock" id="product-stock-${product.id}">Наличие: ${product.quantity}</p>
                        <p class="product_description" id="product-price-${product.id}">Цена: ${product.price} руб.</p>
                        <button type="button" class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                    </div>
                </div>
            `;
            productsList.appendChild(productElement);
        });

        searchInput.addEventListener("input", filterProducts);
        sortSelect.addEventListener("change", sortProducts);
    }

    function filterProducts() {
        if (!productsData) return;

        const filterValue = searchInput.value.toLowerCase();
        const filteredProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(filterValue)
        );

        fetchProducts(filteredProducts);
    }

    function sortProducts() {
        const sortValue = sortSelect.value;
        let sortedProducts = [...productsData];

        switch (sortValue) {
            case "price-asc":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case "stock-asc":
                sortedProducts.sort((a, b) => a.quantity - b.quantity);
                break;
            case "stock-desc":
                sortedProducts.sort((a, b) => b.quantity - a.quantity);
                break;
            default:
                sortedProducts = productsData;
        }

        fetchProducts(sortedProducts);
    }
});