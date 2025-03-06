document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#orders-table tbody");
    const searchInput = document.querySelector(".search_input");

    let usersData = [];

    try {
        const response = await fetch("http://localhost:3000/controllers/users");
        
        console.log('Статус ответа:', response.status);
        const data = await response.json();
        console.log('Ответ от сервера:', data);

        if (!data || data.length === 0) {
            console.error("Ошибка или нет пользователей:", data.error || 'Нет данных');
            alert("Нет пользователей для отображения.");
            return;
        }

        data.sort((a, b) => a.id - b.id);

        usersData = data;

        renderUsers(usersData);

        searchInput.addEventListener("input", function () {
            filterUsers();
        });

    } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        alert("Не удалось загрузить пользователей.");
    }

    function renderUsers(users) {
        tableBody.innerHTML = "";

        users.forEach(user => {
            console.log(`Пользователь ID: ${user.id}, isAdmin: ${user.isadmin}`);
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone_number}</td>
                <td>${user.delivery_address}</td>
                <td>
                    <input type="checkbox" class="admin-checkbox" data-id="${user.id}" ${user.isadmin ? "checked" : ""} ${user.id == 1 ? "disabled" : ""}>
                </td>
                <td>${user.id !== 1 ? `<button class="delete-btn" data-id="${user.id}">Удалить</button>` : ''}</td>
            `;

            tableBody.appendChild(row);
        });

        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll(".admin-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", async function () {
                const userId = this.getAttribute("data-id");
                const newIsAdmin = this.checked;

                console.log(`Изменение isAdmin для пользователя ${userId}: ${newIsAdmin}`);

                try {
                    const response = await fetch(`http://localhost:3000/controllers/${newIsAdmin ? 'update-admin-true' : 'update-admin-false'}/${userId}`, {
                        method: 'PUT'
                    });

                    const result = await response.json();
                    console.log('Ответ сервера:', result);
                } catch (error) {
                    console.error("Ошибка при обновлении пользователя:", error);
                    alert("Не удалось обновить статус администратора.");
                }
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const userId = this.getAttribute("data-id");

                if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
                    await deleteUser(userId);
                }
            });
        });
    }

    async function deleteUser(userId) {
        try {
            const response = await fetch(`http://localhost:3000/controllers/users/${userId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                alert("Пользователь удален!");
                location.reload();
            } else {
                alert("Пользователь удален!");
                location.reload(); 
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    }

    function filterUsers() {
        const filterValue = searchInput.value.toLowerCase();

        const filteredUsers = usersData.filter(user => {
            return (
                String(user.id).toLowerCase().includes(filterValue) ||
                user.name.toLowerCase().includes(filterValue) ||
                user.email.toLowerCase().includes(filterValue) ||
                user.phone_number.toLowerCase().includes(filterValue) ||
                user.delivery_address.toLowerCase().includes(filterValue)
            );
        });

        renderUsers(filteredUsers);
    }
});
