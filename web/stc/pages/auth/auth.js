document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); 
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/controllers/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userPhone", data.phone_number);
            localStorage.setItem("userAddress", data.delivery_address);

            alert("Вы успешно вошли!");
            location.reload(); 
            window.location.href = "/web/stc/pages/main/main.html"; 
        } else {
            alert("Ошибка: Неверный логин или пароль");
        }
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        alert("Что-то пошло не так. Попробуйте позже.");
    }
});

function updateHeader() {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");
    const userName = localStorage.getItem("userName");
    
    const authContainer = document.querySelector(".header_categories:last-child");
    authContainer.innerHTML = ""; // Очищаем контейнер перед изменением

    if (token && userName) {
        const userA = document.createElement("a");
        userA.classList.add("a_categories");
        userA.href="/web/stc/pages/auth/auth.html";
        userA.textContent = userName;

        const logoutBtn = document.createElement("button");
        logoutBtn.classList.add("logout-btn");
        logoutBtn.textContent = "Выйти";
        logoutBtn.onclick = logout;

        authContainer.appendChild(userA);
        authContainer.appendChild(logoutBtn);
    } else {
        const authLink = document.createElement("a");
        authLink.classList.add("a_categories");
        authLink.href = "/web/stc/pages/auth/auth.html";
        authLink.textContent = "Auth";

        authContainer.appendChild(authLink);
    }

    if (isAdmin === "true" && !document.querySelector(".admin-tab")) {
        const adminTab = document.createElement("a");
        adminTab.classList.add("a_categories", "admin-tab");
        adminTab.href = "/web/stc/pages/admin/admin.html";
        adminTab.textContent = "Админ-панель";

        document.querySelector(".header_categories").appendChild(adminTab);
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    location.reload();
}

document.addEventListener("DOMContentLoaded", updateHeader);
