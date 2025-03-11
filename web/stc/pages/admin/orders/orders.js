document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#orders-table tbody");
    const searchInput = document.querySelector(".search_input");

    let ordersData = [];

    try {
        const response = await fetch("http://localhost:3000/controllers/get-orders");
        
        console.log('Статус ответа:', response.status);
        const data = await response.json();
        console.log('Ответ от сервера:', data);

        data.orders.sort((a, b) => a.id - b.id);

        ordersData = data.orders;

        renderOrders(ordersData);

        searchInput.addEventListener("input", function () {
            filterOrders();
        });

    } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
    }

    function renderOrders(orders) {
        tableBody.innerHTML = "";
    
        orders.forEach(order => {
            const row = document.createElement("tr");
        
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.email}</td>
                <td>${order.phone_number}</td>
                <td>${order.delivery_address}</td>
                <td>${order.product_name.join(", ")}</td> 
                <td>${order.quantity.join(", ")}</td>
                <td>
                    <button class="delete-btn" data-id="${order.id}">Отменить</button>
                    <button class="update-btn" data-id="${order.id}">Выполнить</button>
                </td>
            `;
        
            tableBody.appendChild(row);
        });
        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const orderId = this.getAttribute("data-id");
    
                if (confirm("Вы уверены, что хотите отменить этот заказ?")) {
                    await cancelOrder(orderId);
                    await deleteOrder(orderId);
                }
            });
        });
    
        document.querySelectorAll(".update-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const orderId = this.getAttribute("data-id");
                
                // Найти заказ по ID
                const order = ordersData.find(o => o.id == orderId);
                if (!order) {
                    console.error("Заказ не найден!");
                    return;
                }

                const productIds = order.product_id; 
                console.log("porpcwcw", productIds);// Берем product_id из данных, а не из таблицы
                const quantities = order.quantity.map(qty => Number(qty)); // Убедимся, что qty — число

                if (confirm("Вы уверены, что хотите завершить этот заказ?")) {
                    await updateOrder(orderId, productIds, quantities);
                    await deleteOrder(orderId);
                }
            });
        });
    }

    function filterOrders() {
        const filterValue = searchInput.value.toLowerCase();

        const filteredOrders = ordersData.filter(order => {
            return (
                String(order.id).toLowerCase().includes(filterValue) ||
                order.name.toLowerCase().includes(filterValue) ||
                order.email.toLowerCase().includes(filterValue) ||
                order.phone_number.toLowerCase().includes(filterValue) ||
                order.delivery_address.toLowerCase().includes(filterValue) ||
                String(order.product_id).toLowerCase().includes(filterValue)
            );
        });

        renderOrders(filteredOrders);
    }
});

async function deleteOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/controllers/delete-order/${orderId}`, {
            method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
            location.reload();
        } else {
        }
    } catch (error) {
    }
}

async function cancelOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/controllers/cancel-status/${orderId}`, {
            method: "PUT",
        });

        const result = await response.json();

        if (result.success) {
            alert("Статус обновлен!");
            location.reload();
        } else {
            alert("Статус обновлен!");
        }
    } catch (error) {
        console.error("Ошибка при удалении:", error);
    }
}

async function updateOrder(orderId, productIds, quantities) {
    try {
        const response = await fetch(`http://localhost:3000/controllers/update-status/${orderId}`, {
            method: "PUT",
        });

        if (productIds.length !== quantities.length) {
            console.error("Ошибка: Количество товаров и их ID не совпадают!");
            return;
        }

        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const quantity = quantities[i];

            console.log(`Отправляем в /minus: product_id=${productId}, quantity=${quantity}`);

            await fetch('http://localhost:3000/controllers/minus', {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: productId, orderQuantity: quantity })
            });
        }

        const result = await response.json();

        if (result.success) {
            alert("Статус обновлен!");
            location.reload();
        } else {
            alert("Статус обновлен!");
        }
    } catch (error) {
        console.error("Ошибка при удалении:", error);
    }
}
