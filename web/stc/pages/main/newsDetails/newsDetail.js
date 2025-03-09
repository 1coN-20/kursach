document.addEventListener("DOMContentLoaded", async function() {
    const newsId = localStorage.getItem('selectedNewsId');

    if (!newsId) {
        alert('Не удалось найти новость.');
        return;
    }
        const response = await fetch(`http://localhost:3000/controllers/get-news/${newsId}`,{
            method: "GET",
        });

        console.log(response);

        const data = await response.json();

        console.log("Ответ от сервера:", data);

        if (!response.ok) {
            throw new Error(data.error || 'Неизвестная ошибка');
        }

        const article = data.news;
        if (!article) {
            alert('Новость не найдена.');
            return;
        }

        const titleElement = document.getElementById('news-title');
        const imageElement = document.getElementById('news-image');
        const dateElement = document.getElementById('news-date');
        const contentElement = document.getElementById('news-content');

        titleElement.textContent = article.title;

        const formattedDate = new Date(article.published_at).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        dateElement.textContent = `Дата: ${formattedDate}`;

        imageElement.src = `/web/img/news/${article.image_url}`;
        imageElement.alt = article.title;

        contentElement.textContent = article.content;

        function autoResizeTextarea() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        }
    
        autoResizeTextarea.call(contentElement);
});