document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.getElementById("product-price");

    function autoResizeTextarea() {
        this.style.height = 'auto'; 
        this.style.height = (this.scrollHeight) + 'px'; 
    }

    textarea.addEventListener("input", autoResizeTextarea);

    document.getElementById("add-product-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("product-name").value;
        const image_url = document.getElementById("product-image").value;
        const content = document.getElementById("product-price").value;

        if (!title || !image_url || !content ) {
            alert("Пожалуйста, заполните все поля корректно!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/controllers/add-news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, image_url, content })
            });

            const data = await response.json();

            if (data.success) {
                alert('Новость успешно добавлена!');
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
    const textarea = document.getElementById("change-product-price");

    function autoResizeTextarea() {
        this.style.height = 'auto'; 
        this.style.height = (this.scrollHeight) + 'px'; 
    }

    textarea.addEventListener("input", autoResizeTextarea);

const productIdInput = document.getElementById("product-id");
const title = document.getElementById("change-product-name");
const image_url = document.getElementById("change-product-image");
const content = document.getElementById("change-product-price");    

let timeout = null;

productIdInput.addEventListener("input", function () {
    clearTimeout(timeout);

    const id = productIdInput.value.trim();
    console.log("Updated id:", id);

    fetchProductData(id);
});

async function fetchProductData(newsId) {
    try {
        const response = await fetch(`http://localhost:3000/controllers/get-news/${newsId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error("Ошибка загрузки данных");
        }

        const data = await response.json();
        console.log("News data:", data); 

        const product = data.news;

        console.log(product);

        if (product) {
            title.value = product.title || "";
            image_url.value = product.image_url || "";
            content.value = product.content || "";

            enableFields();
            autoResizeTextarea.call(content);
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
    title.value = "";
    image_url.value = "";
    content.value = "";

    enableFields();
}

title.addEventListener("input", enableFields());
});

document.addEventListener("DOMContentLoaded", function () {
document.getElementById("change-product-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const id = document.getElementById("product-id").value;
    const title = document.getElementById("change-product-name").value;
    const image_url = document.getElementById("change-product-image").value;
    const content = document.getElementById("change-product-price").value;
    
    console.log('content:', content);      

    try {
        const response = await fetch('http://localhost:3000/controllers/change-news', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title, image_url, content })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const updatedName = data.product?.title || title || "Товар";
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


document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#orders-table tbody");
    const searchInput = document.querySelector(".search_input");

    let productsData = [];

    try {
        const response = await fetch("http://localhost:3000/controllers/get-all-news");
        
        console.log('Статус ответа:', response.status);
        const data = await response.json();
        console.log('Ответ от сервера:', data);

        if (!data || data.length === 0) {
            console.error("Ошибка или нет пользователей:", data.error || 'Нет данных');
            alert("Нет пользователей для отображения.");
            return;
        }

        data.news.sort((a, b) => a.id - b.id);

        productsData = data.news;

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

            const formattedDate = new Date(products.published_at).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            row.innerHTML = `
                <td>${products.id}</td>
                <td>${products.title}</td>
                <td>${products.image_url}</td>
                <td><a class="news-link" data-id="${products.id}" href="/web/stc/pages/admin/news/newsContent/newsContent.html">Просмотреть</a></td>
                <td>${formattedDate}</td>
                <td>
                    <button class="delete-btn" data-id="${products.id}">Удалить</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        document.querySelectorAll('.news-link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const newsId = this.getAttribute('data-id');
                localStorage.setItem('selectedNewsId', newsId);
                window.location.href = this.href;
            });
        });

        addEventListeners();
    }

    function filterProducts() {
        const filterValue = searchInput.value.toLowerCase();

        const filteredProducts = productsData.filter(products => {
            return (
                String(products.id).toLowerCase().includes(filterValue) ||
                products.title.toLowerCase().includes(filterValue) ||
                products.image_url.toLowerCase().includes(filterValue) ||
                products.published_at.toLowerCase().includes(filterValue)
            );
        });

        renderProducts(filteredProducts);
    }
});

function addEventListeners() {

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const productId = this.getAttribute("data-id");

            if (confirm("Вы уверены, что хотите удалить эту новость?")) {
                await deleteProduct(productId);
            }
        });
    });
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/controllers/delete-news/${productId}`, {
            method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
            alert("Новость удалена!");
            location.reload();
        } else {
            alert("Новость удалена");
            location.reload();
        }
    } catch (error) {
    }
}