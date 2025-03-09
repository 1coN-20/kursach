document.addEventListener("DOMContentLoaded", async function() {
    async function fetchNews() {
        try {
            const response = await fetch('http://localhost:3000/controllers/get-all-news');
            const data = await response.json();

            console.log("Ответ от сервера:", data);

            if (!response.ok) {
                throw new Error(data.error || 'Неизвестная ошибка');
            }

            const news = data.news || [];
            console.log("Загруженные новости:", news);

            const newsList = document.querySelector('.main_list_products');
            if (!newsList) {
                console.error("Ошибка: ul.main_list_products не найден!");
                return;
            }

            newsList.innerHTML = ''; 

            news.forEach(article => {
                console.log("Добавление новости:", article.title);

                const formattedDate = new Date(article.published_at).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });

                const newsElement = document.createElement('li');
                newsElement.innerHTML = `
                    <a href="/web/stc/pages/main/newsDetails/newsDetails.html" class="news-link" data-id="${article.id}">
                        <div class="product_div1">
                            <p class="product_header">${article.title}</p>
                            <p class="news_date">${formattedDate}</p>
                            <div class="product_div2">
                                <img class="product_img" src="/web/img/news/${article.image_url}" alt="${article.title}">
                            </div>
                        </div>
                    </a>
                `;
                newsList.appendChild(newsElement);
            });

            document.querySelectorAll('.news-link').forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const newsId = this.getAttribute('data-id');
                    localStorage.setItem('selectedNewsId', newsId);
                    window.location.href = this.href;
                });
            });

        } catch (error) {
            console.error('Ошибка при получении новостей:', error);
            alert('Не удалось загрузить новости.');
        }
    }

    fetchNews();
});