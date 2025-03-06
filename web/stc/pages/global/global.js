document.addEventListener("DOMContentLoaded", function() {
    updateHeader();
    updateCartItemCount();
});

function updateHeader() {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const userName = localStorage.getItem("userName");

    const authContainer = document.querySelector(".wrapper > a[href='/web/stc/pages/auth/auth.html']");

    if (token && userName && authContainer) {
        authContainer.outerHTML = `
            <div class="user-menu">
                <button class="user-button">${userName}</button>
                <div class="dropdown">
                    <a class="top" href="/web/stc/pages/usersPage/usersPage.html">Личный кабинет</a>
                    ${isAdmin ? `<a class="middle" href="/web/stc/pages/admin/admin.html">Админ-панель</a>` : ""}
                    <a class="bottom" href="#" id="logout-btn">Выйти</a>
                </div>
            </div>
        `;

        addDropdownEvents();
    }
}

function addDropdownEvents() {
    const userButton = document.querySelector(".user-button");
    const dropdown = document.querySelector(".dropdown");

    if (userButton && dropdown) {
        userButton.addEventListener("mouseenter", function () {
            dropdown.style.opacity = "1";
            dropdown.style.visibility = "visible";
            dropdown.style.transform = "translateX(-50%) translateY(0)";
        });

        document.querySelector(".user-menu").addEventListener("mouseleave", function () {
            dropdown.style.opacity = "0";
            dropdown.style.visibility = "hidden";
            dropdown.style.transform = "translateX(-50%) translateY(-10px)";
        });

        document.getElementById("logout-btn").addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userPhone");
            localStorage.removeItem("userAddress");
            location.reload();
        });
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    location.reload();
}

function updateCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemCount = document.getElementById("cart-item-count");
    
    if (cartItemCount) {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartItemCount.innerHTML = totalQuantity;
    }
}