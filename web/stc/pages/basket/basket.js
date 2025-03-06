document.addEventListener("DOMContentLoaded", function() {
    loadCartItems();
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

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("cart-total"); 
    const tableBody = document.querySelector("#orders-table tbody");
    const cartMessage = document.getElementById("cart-message");
    const ordersTable = document.getElementById("orders-table");

    cartContainer.innerHTML = "";
    totalContainer.innerHTML = ""; 
    tableBody.innerHTML = "";
    cartMessage.innerHTML = "";

    if (cart.length === 0) {
        cartMessage.innerHTML = "<p>Корзина пуста</p>";
        ordersTable.style.display = "none"; 
        return;
    }

    ordersTable.style.display = "table";

    let totalPrice = 0;

    cart.forEach((product, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td><img class="table_img" src="${product.image_url}"></td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.quantity}</td>
        <td><button class="remove-button" data-index="${index}">Удалить</button></td>
        `;
        
        tableBody.appendChild(row);

        totalPrice += product.price * product.quantity; 
        totalContainer.innerHTML = `<h3>Общая сумма заказа: ${totalPrice.toFixed(2)} руб.</h3>`;
    });

    document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", function() {
            removeItem(this.getAttribute("data-index"));
            location.reload();
        });
    });
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
}

document.getElementById("order-button").addEventListener("click", async function () {
    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const phone_number = document.getElementById("user-phone").value.trim();
    const delivery_address = document.getElementById("user-address").value.trim();

    if (!name || !email || !phone_number || !delivery_address) {
        alert("Заполните все поля!");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Ваша корзина пуста.");
        return;
    }

    let product_id = cart.map(item => item.id); 
    let quantity = cart.map(item => Number(item.quantity));  

    console.log("Отправляемые данные:", { name, email, phone_number, delivery_address, product_id, quantity });

    try {
        const response = await fetch('http://localhost:3000/controllers/add-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone_number, delivery_address, product_id, quantity })
        });

        const data = await response.json();

        if (data.success) {
            alert(`Спасибо за заказ, ${name}! Мы свяжемся с вами для подтверждения.`);

            localStorage.removeItem("cart");
            loadCartItems();
            location.reload();
        } else {
            alert(`Ошибка: ${data.error}`);
        }
    } catch (error) {
        console.error("Ошибка при отправке заказа:", error);
    }
});