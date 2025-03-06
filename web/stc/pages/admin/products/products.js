document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#orders-table tbody");
    const searchInput = document.querySelector(".search_input");

    let productsData = [];

    try {
        const response = await fetch("http://localhost:3000/controllers/get-products");
        
        console.log('Статус ответа:', response.status);
        const data = await response.json();
        console.log('Ответ от сервера:', data);

        if (!data || data.length === 0) {
            console.error("Ошибка или нет пользователей:", data.error || 'Нет данных');
            alert("Нет пользователей для отображения.");
            return;
        }

        data.products.sort((a, b) => a.id - b.id);

        productsData = data.products;

        renderProducts(productsData);

        searchInput.addEventListener("input", function () {
            filterProducts();
        });

    } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
        alert("Не удалось загрузить заказы.");
    }

    function renderProducts(products) {
        tableBody.innerHTML = "";

        products.forEach(products => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${products.id}</td>
                <td>${products.name}</td>
                <td>${products.image_url}</td>
                <td>${products.price}</td>
                <td>${products.quantity}</td>
                <td>
                    <button class="delete-btn" data-id="${products.id}">Удалить</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        addEventListeners();
    }

    function filterProducts() {
        const filterValue = searchInput.value.toLowerCase();

        const filteredProducts = productsData.filter(products => {
            return (
                String(products.id).toLowerCase().includes(filterValue) ||
                products.name.toLowerCase().includes(filterValue) ||
                products.image_url.toLowerCase().includes(filterValue) ||
                String(products.price).toLowerCase().includes(filterValue) ||
                String(products.quantity).toLowerCase().includes(filterValue)
            );
        });

        renderProducts(filteredProducts);
    }
});

function addEventListeners() {

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const productId = this.getAttribute("data-id");

            if (confirm("Вы уверены, что хотите удалить этот товар?")) {
                await deleteProduct(productId);
            }
        });
    });
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/controllers/delete-product/${productId}`, {
            method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
            alert("Товар удален!");
            location.reload();
        } else {
            alert("Товар удален!");
            location.reload();
        }
    } catch (error) {
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("add-product-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("product-name").value;
        const image_url = document.getElementById("product-image").value;
        const price = parseFloat(document.getElementById("product-price").value);
        const quantity = parseInt(document.getElementById("product-quantity").value);

        if (!name || !image_url || isNaN(price) || isNaN(quantity)) {
            alert("Пожалуйста, заполните все поля корректно!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/controllers/add-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image_url, price, quantity })
            });

            const data = await response.json();

            if (data.success) {
                alert('Товар успешно добавлен!');
                location.reload();
            } else {
                alert(`Ошибка: ${data.error}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            alert('Ошибка при соединении с сервером.');
        }
    });
});

function enableFields() {
        const nameValue = document.getElementById('change-product-name').value.trim();

        const fields = [
            'change-product-name',
            'change-product-image',
            'change-product-price',
            'change-product-quantity'
        ];

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (nameValue !== "") { 
                field.removeAttribute('disabled');
            } else { 
                field.setAttribute('disabled', 'true');
            }
        });
}


document.addEventListener("DOMContentLoaded", function () {
    const productIdInput = document.getElementById("product-id");
    const name = document.getElementById("change-product-name");
    const image_url = document.getElementById("change-product-image");
    const price = document.getElementById("change-product-price");
    const quantity = document.getElementById("change-product-quantity");     

    let timeout = null;

    productIdInput.addEventListener("input", function () {
        clearTimeout(timeout);

        const id = productIdInput.value.trim();
        console.log("Updated id:", id);

        fetchProductData(id);
    });

    async function fetchProductData(productId) {
        try {
            const response = await fetch(`http://localhost:3000/controllers/get-products/${productId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error("Ошибка загрузки данных");
            }

            const data = await response.json();
            console.log("Product data:", data); 

            const product = data.products.find(p => p.id == productId);

            if (product) {
                name.value = product.name || "";
                image_url.value = product.image_url || "";
                price.value = product.price ? parseFloat(product.price) : "";
                quantity.value = product.quantity ? parseInt(product.quantity) : "";

                enableFields();
            } else {
                console.warn("Товар с таким ID не найден.");
                clearFields();
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
            clearFields();
        }
    }

    function clearFields() {
        name.value = "";
        image_url.value = "";
        price.value = "";
        quantity.value = "";

        enableFields();
    }

    name.addEventListener("input", enableFields());
});



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("change-product-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const productId = document.getElementById("product-id").value;
        const name = document.getElementById("change-product-name").value;
        const image_url = document.getElementById("change-product-image").value;
        const price = parseFloat(document.getElementById("change-product-price").value);
        const quantity = parseInt(document.getElementById("change-product-quantity").value);     
        
        console.log('productId:', productId);
        console.log('name:', name);
        console.log('image_url:', image_url);
        console.log('price:', price);
        console.log('quantity:', quantity);        

        try {
            const response = await fetch('http://localhost:3000/controllers/change-product', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, name, image_url, price, quantity })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const updatedName = data.product?.name || name || "Товар";
                alert(`Товар "${updatedName}" успешно обновлен!`);
                location.reload();
            } else {
                alert(`Ошибка: ${data.error || "Не удалось обновить товар"}`);
            }

        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            alert("Ошибка при соединении с сервером.");
        }
    });
});

