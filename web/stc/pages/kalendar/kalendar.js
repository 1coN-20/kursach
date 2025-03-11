document.addEventListener("DOMContentLoaded", async () => {
    const gamesList = document.querySelector(".main_list");
    const searchInput = document.querySelector(".search_input");
    const sortSelect = document.querySelector(".sort_select");

    let gamesData = [];

    async function fetchGames() {
        try {
            const response = await fetch("http://localhost:3000/controllers/get-games");
            const data = await response.json();
            console.log("Полученные данные:", data);

            if (data.success && Array.isArray(data.games)) {
                gamesData = data.games;
                renderGames(gamesData);
            } else {
                console.error("Ошибка: полученные данные не содержат массив игр", data);
            }
        } catch (error) {
            console.error("Ошибка загрузки игр:", error);
        }
    }

    function renderGames(games) {
        gamesList.innerHTML = "";

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

    function filterGames() {
        const filterValue = searchInput.value.toLowerCase();

        const filteredGames = gamesData.filter(game =>
            game.team_name.toLowerCase().includes(filterValue)
        );

        renderGames(filteredGames);
    }

    function sortGames() {
        const sortValue = sortSelect.value;
        let sortedGames = [...gamesData];

        switch (sortValue) {
            case "date-asc":
                sortedGames.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "date-desc":
                sortedGames.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "home-first":
                sortedGames.sort((a, b) => b.home - a.home);
                break;
            case "away-first":
                sortedGames.sort((a, b) => a.home - b.home);
                break;
            default:
                sortedGames = gamesData;
        }

        renderGames(sortedGames);
    }

    searchInput.addEventListener("input", filterGames);
    sortSelect.addEventListener("change", sortGames);

    fetchGames();
});