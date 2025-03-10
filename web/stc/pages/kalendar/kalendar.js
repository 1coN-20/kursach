document.addEventListener("DOMContentLoaded", async () => {
    const gamesList = document.querySelector(".main_list");

    async function fetchGames() {
        try {
            const response = await fetch("http://localhost:3000/controllers/get-games");
            const data = await response.json();
            console.log("Полученные данные:", data);
    
            if (data.success && Array.isArray(data.games)) {
                renderGames(data.games);
            } else {
                console.error("Ошибка: полученные данные не содержат массив игр", data);
            }
        } catch (error) {
            console.error("Ошибка загрузки игр:", error);
        }
    }

    function renderGames(games) {
        gamesList.innerHTML = "";

        console.log("Тип данных games:", typeof games);
        console.log("Array.isArray(games):", Array.isArray(games));
        console.log("Полученные данные:", games);

        games.forEach(game => {
            const gameDate = new Date(game.date);
            
                const formattedDate = gameDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });

            const li = document.createElement("li");
            li.classList.add("list_obj");

            const listObjTop = document.createElement("div");
            listObjTop.classList.add("list_obj_top");
            listObjTop.innerHTML = `<p>${formattedDate}</p><p>${game.home ? 'ул. Уральская 3А' : game.team_home_address}</p>`;

            const listObjBottom = document.createElement("div");
            listObjBottom.classList.add("list_obj_bottom");

            const team1 = document.createElement("div");
            team1.classList.add("div_team1");
            team1.innerHTML = !game.home
                ? `<img class="team_photo" src="/web/img/logo/${game.team_image_url}" alt="${game.team_name}"><p>${game.team_name}</p>`
                : `<img class="team_photo" src="/web/img/logo/bk_minsk.png" alt="БК Минск"><p>БК Минск</p>`;

            const team2 = document.createElement("div");
            team2.classList.add("div_team1");
            team2.innerHTML = game.home
                ? `<img class="team_photo" src="/web/img/logo/${game.team_image_url}" alt="${game.team_name}"><p>${game.team_name}</p>`
                : `<img class="team_photo" src="/web/img/logo/bk_minsk.png" alt="БК Минск"><p>БК Минск</p>`;

            listObjBottom.appendChild(team1);
            listObjBottom.appendChild(team2);

            li.appendChild(listObjTop);
            li.appendChild(listObjBottom);
            gamesList.appendChild(li);
        });
    }

    fetchGames();
});
