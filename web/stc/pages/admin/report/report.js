function downloadExcel() {
    window.location.href = "http://localhost:3000/controllers/export-orders"; // Перенаправляем на маршрут для скачивания Excel
}

fetch("http://localhost:3000/controllers/report")
    .then(response => response.json())
    .then(data => {
        
        document.getElementById('bestSellingProduct').textContent = data.bestSellingProduct;
        document.getElementById('completionRate').textContent = data.completionRate;
        document.getElementById('cancelRate').textContent = data.cancelRate;

        
        const ctx = document.getElementById('ordersChart').getContext('2d');
        const ordersChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.weekDays, 
                datasets: [{
                    label: 'Количество заказов',
                    data: data.ordersMap, 
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });