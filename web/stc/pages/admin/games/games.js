document.addEventListener("DOMContentLoaded", async function () {
    const teamSelect = document.getElementById("team-select");

    try {
        const response = await fetch("http://localhost:3000/controllers/get-teams");
        const data = await response.json();

        if (data.success && data.teams.length > 0) {
            data.teams.forEach(team => {
                const option = document.createElement("option");
                option.value = team.id;
                option.textContent = team.name;
                teamSelect.appendChild(option);
            });
        } else {
            console.error("Команды не найдены");
        }
    } catch (error) {
        console.error("Ошибка при загрузке команд:", error);
    }
});

document.getElementById("add-game-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const enemy = document.getElementById("team-select").value;
    const home = document.getElementById("game-home").checked;
    const date = document.getElementById("game-date").value;

    if (!enemy || !date) {
        alert("Выберите команду и дату!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/controllers/add-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enemy, home, date })
        });

        const result = await response.json();

        if (result.success) {
            alert("Игра успешно добавлена!");
            document.getElementById("add-game-form").reset();
            location.reload();
        } else {
            alert("Ошибка: " + result.error);
        }
    } catch (error) {
        console.error("Ошибка при добавлении игры:", error);
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const ordersTableBody = document.querySelector("#orders-table tbody");

    try {
        const response = await fetch("http://localhost:3000/controllers/get-games");
        const data = await response.json();

        if (data.success && data.games.length > 0) {
            data.games.forEach(game => {
                const row = document.createElement("tr");

                const gameIdCell = document.createElement("td");
                gameIdCell.textContent = game.game_id;
                row.appendChild(gameIdCell);

                const teamNameCell = document.createElement("td");
                teamNameCell.textContent = game.team_name;
                row.appendChild(teamNameCell);

                const teamImageUrlCell = document.createElement("td");
                teamImageUrlCell.textContent = game.team_image_url;
                row.appendChild(teamImageUrlCell);

                const teamHomeAddressCell = document.createElement("td");
                if (!game.home) {
                    teamHomeAddressCell.textContent = game.team_home_address;
                } else {
                    teamHomeAddressCell.textContent = "ул.Уральская 3А";
                }
                row.appendChild(teamHomeAddressCell);

                const dateCell = document.createElement("td");

                const gameDate = new Date(game.date);
            
                const formattedDate = gameDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
                
               
                dateCell.textContent = formattedDate;
                row.appendChild(dateCell);

                const actionCell = document.createElement("td");
                const actionButton = document.createElement("button");
                actionButton.textContent = "Удалить";
                actionButton.classList.add("delete-btn");

                actionButton.addEventListener("click", async function () {
                    const confirmDelete = confirm("Вы уверены, что хотите удалить эту игру?");
                    if (confirmDelete) {
                        try {
                            const deleteResponse = await fetch(`http://localhost:3000/controllers/delete-game/${game.game_id}`, {
                                method: "DELETE",
                            });
                            const result = await deleteResponse.json();

                            if (result.success) {
                                alert("Игра успешно удалена!");
                                row.remove(); 
                            } else {
                                alert("Ошибка при удалении игры: " + result.error);
                            }
                        } catch (error) {
                            console.error("Ошибка при удалении игры:", error);
                            alert("Ошибка при удалении игры.");
                        }
                    }
                });

                actionCell.appendChild(actionButton);
                row.appendChild(actionCell);

                ordersTableBody.appendChild(row);
            });
        } else {
            console.error("Игры не найдены");
        }
    } catch (error) {
        console.error("Ошибка при загрузке списка игр:", error);
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const teamSelect = document.getElementById("change-team-select");
    const gameHomeCheckbox = document.getElementById("change-game-home");
    const gameDateInput = document.getElementById("change-game-date");
    const productIdInput = document.getElementById("product-id");
    const form = document.getElementById("change-product-form");

    function formatDateForInput(dateString) {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function clearFields() {
        teamSelect.value = "";
        gameHomeCheckbox.checked = false;
        gameDateInput.value = "";
    }

    function toggleFields() {
        const isDateFilled = gameDateInput.value.trim() !== "";

        teamSelect.disabled = !isDateFilled;
        gameHomeCheckbox.disabled = !isDateFilled;
        gameDateInput.disabled = !isDateFilled;
    }

    function enableFields() {
        const productId = productIdInput.value.trim();

        if (!productId) {
            clearFields();
            toggleFields();
            return;
        }

        fetch(`http://localhost:3000/controllers/get-game/${productId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.game) {
                    const game = data.game;
                    teamSelect.value = game.enemy;
                    gameHomeCheckbox.checked = game.home;
                    gameDateInput.value = formatDateForInput(game.date);
                } else {
                    clearFields();
                    alert("Игра не найдена");
                }
                toggleFields();
            })
            .catch(error => {
                clearFields();
                console.error("Ошибка при загрузке игры:", error);
                toggleFields();
            });
    }

    productIdInput.addEventListener("input", enableFields);
    gameDateInput.addEventListener("input", toggleFields);

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = productIdInput.value.trim();
        const enemy = teamSelect.value;
        const home = gameHomeCheckbox.checked;
        const date = gameDateInput.value;

        await fetch("http://localhost:3000/controllers/update-game", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, enemy, home, date }),
        });

        location.reload();
    });

    try {
        const response = await fetch("http://localhost:3000/controllers/get-teams");
        const data = await response.json();

        if (data.success && data.teams.length > 0) {
            data.teams.forEach(team => {
                const option = document.createElement("option");
                option.value = team.id;
                option.textContent = team.name;
                teamSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Ошибка при загрузке команд:", error);
    }

    toggleFields(); // Проверка полей при загрузке
});