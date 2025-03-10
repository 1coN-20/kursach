document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("add-product-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("product-name").value;
        const image_url = document.getElementById("product-image").value;
        const home_address = document.getElementById("product-address").value;

        if (!name || !image_url ) {
            alert("Пожалуйста, заполните все поля корректно!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/controllers/add-team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image_url, home_address })
            });

            const data = await response.json();

            if (data.success) {
                alert('Команда успешно добавлена!');
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


document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#orders-table tbody");
    const searchInput = document.querySelector(".search_input");

    let productsData = [];

    try {
        const response = await fetch("http://localhost:3000/controllers/get-teams");
        
        console.log('Статус ответа:', response.status);
        const data = await response.json();
        console.log('Ответ от сервера:', data);

        if (!data || data.length === 0) {
            console.error("Ошибка или нет пользователей:", data.error || 'Нет данных');
            alert("Нет пользователей для отображения.");
            return;
        }

        data.teams.sort((a, b) => a.id - b.id);

        productsData = data.teams;

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
                <td>${products.home_address}</td>
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
                products.home_address.toLowerCase().includes(filterValue)
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
        const response = await fetch(`http://localhost:3000/controllers/delete-team/${productId}`, {
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

function enableFields() {
    const nameValue = document.getElementById('change-product-name').value.trim();

    const fields = [
        'change-product-name',
        'change-product-image',
        'change-product-address'
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
const home_address = document.getElementById("change-product-address");

let timeout = null;

productIdInput.addEventListener("input", function () {
    clearTimeout(timeout);

    const id = productIdInput.value.trim();
    console.log("Updated id:", id);

    fetchProductData(id);
});

async function fetchProductData(productId) {
    try {
        const response = await fetch(`http://localhost:3000/controllers/get-team/${productId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error("Ошибка загрузки данных");
        }

        const data = await response.json();
        console.log("Product data:", data); 

        const product = data.team;

        if (product) {
            name.value = product.name || "";
            image_url.value = product.image_url || "";
            home_address.value = product.home_address || "";

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
    home_address.value = "";

    enableFields();
}

name.addEventListener("input", enableFields());
});



document.addEventListener("DOMContentLoaded", function () {
document.getElementById("change-product-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const id = document.getElementById("product-id").value;
    const name = document.getElementById("change-product-name").value;
    const image_url = document.getElementById("change-product-image").value;
    const home_address = document.getElementById("change-product-address").value;
 
    console.log('productId:', id);
    console.log('name:', name);
    console.log('image_url:', image_url);

    try {
        const response = await fetch('http://localhost:3000/controllers/change-team', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, image_url, home_address })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const updatedName = data.team?.name || name || "Товар";
            alert(`Команда "${updatedName}" успешно обновлена!`);
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

