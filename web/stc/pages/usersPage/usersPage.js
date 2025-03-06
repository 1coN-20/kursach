document.addEventListener("DOMContentLoaded", function() {
    autoFillUserInfo();
});

function autoFillUserInfo() {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userPhone = localStorage.getItem("userPhone");
    const userAddress = localStorage.getItem("userAddress");

    if (userName) {
        document.getElementById("user-name").value = userName;
    }
    if (userEmail) {
        document.getElementById("user-email").value = userEmail;
    }
    if (userPhone) {
        document.getElementById("user-phone").value = userPhone;
    }
    if (userAddress) {
        document.getElementById("user-address").value = userAddress;
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#orders-table tbody");
    const userName = localStorage.getItem("userName");

    if (!userName) {
        alert("Ошибка: Имя пользователя не найдено!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/controllers/get-userorder/${userName}`, {
            method: "GET",
        });

        const data = await response.json();
        console.log("Ответ от сервера:", data);

        if (!data.success || !data.orders) {
            console.error("Ошибка или нет заказов:", data.error || "Нет данных");
            alert("Нет заказов для отображения.");
            return;
        }

        data.orders.sort((a, b) => b.id - a.id);

        tableBody.innerHTML = "";

        data.orders.forEach(order => {
            const row = document.createElement("tr");

            const products = order.product_id ? order.product_id.join(", ") : "Неизвестно";
            const quantities = order.quantity ? order.quantity.join(", ") : "Неизвестно";

            let status = "Неизвестно";
            if (order.order_status === "Выполнен") status = "Готов к выдаче";
            else if (order.order_status === "Отменен") status = "Отменен";
            else if (order.order_status === "В процессе") status = "В процессе";

            row.innerHTML = `
                <td>${products}</td>
                <td>${quantities}</td>
                <td class="${status === 'Готов к выдаче' ? 'completed' : status === 'Отменен' ? 'canceled' : ''}">${status}</td>
                <td>${status === "В процессе" ? `<button class="delete-btn" data-id="${order.id}">Отменить</button>` : ''}</td>
            `;

            tableBody.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const orderId = this.getAttribute("data-id");

                if (confirm("Вы уверены, что хотите отменить этот заказ?")) {
                    try {
                        await cancelOrder(orderId);
                        await deleteOrder(orderId);
                        alert("Заказ отменен.");
                        location.reload();
                    } catch (error) {
                        console.error("Ошибка при отмене заказа:", error);
                        alert("Ошибка при отмене заказа.");
                    }
                }
            });
        });

    } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
        alert("Не удалось загрузить заказы. Проверьте соединение с сервером.");
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
        
    } catch (error) {
        console.error("Ошибка при удалении:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("update-button").addEventListener("click", async function (event) {
    
        event.preventDefault();

        const response = await fetch("http://localhost:3000/controllers/users");

        const data = await response.json();
        console.log('Ответ от сервера:', data);

        const nowUserEmail = localStorage.getItem("userEmail");
        console.log(nowUserEmail);

        const user = data.find(user => user.email === nowUserEmail);

        if (!user) {
            alert("Пользователь не найден");
            return;
        }

        console.log("ID User = ", user.id);

        const id = user.id;

        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const phone_number = document.getElementById('user-phone').value;
        const delivery_address = document.getElementById('user-address').value;

        try {
            const response = await fetch('http://localhost:3000/controllers/update-users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    email: email,
                    phone_number: phone_number,
                    delivery_address: delivery_address
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Данные обновлены!");
            } else {
                alert(`Ошибка: ${result.message}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при обновлении данных.");
        }
    });
});
