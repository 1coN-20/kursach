document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#orders-table tbody");
    const searchInput = document.querySelector(".search_input");

    let ordersData = [];

    try {
        const response = await fetch("http://localhost:3000/controllers/get-allorders");
        
        console.log('Статус ответа:', response.status);
        const data = await response.json();
        console.log('Ответ от сервера:', data);

        if (!data.success || !data.orders || data.orders.length === 0) {
            console.error("Ошибка или нет заказов:", data.error || 'Нет данных');
            alert("Нет заказов для отображения.");
            return;
        }

        data.orders.sort((a, b) => b.id - a.id);

        ordersData = data.orders;

        renderOrders(ordersData);

        searchInput.addEventListener("input", function () {
            filterOrders();
        });

    } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
        alert("Не удалось загрузить заказы.");
    }

    function renderOrders(orders) {
        tableBody.innerHTML = "";
    
        orders.forEach(order => {
            const row = document.createElement("tr");
        
            const products = order.product_id.join(", ");
            const quantities = order.quantity.join(", ");
        
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.email}</td>
                <td>${order.phone_number}</td>
                <td>${order.delivery_address}</td>
                <td>${products}</td>
                <td>${quantities}</td>
                <td class="${order.order_status === 'Выполнен' ? 'completed' : order.order_status === 'Отменен' ? 'canceled' : ''}">
                ${order.order_status}</td>
            `;
        
            tableBody.appendChild(row);
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
