const API_KEY = '4cf28bac2f444cbbaf5179b3fd73cc65';
let allArticles = [];

async function getNews(category = '') {
  const baseUrl = 'https://newsapi.org/v2/top-headlines';
  const params = new URLSearchParams({
    apiKey: API_KEY,
    country: 'us',  
  });

  if (category && category !== 'all') {
    params.append('category', category);
  }

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    allArticles = data.articles || [];
    renderNews(allArticles);
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
  }
}

function renderNews(articles) {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';

  // Фильтруем статьи, у которых есть изображение
  const filtered = articles.filter(article => article.urlToImage);

  if (!filtered.length) {
    container.innerHTML = '<p>Нет новостей с изображениями по выбранной категории.</p>';
    return;
  }

  filtered.forEach((article) => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${article.urlToImage}" alt="Изображение" class="news-image">
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || 'Описание отсутствует'}</p>
        <a href="${article.url}" target="_blank">Читать далее</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Обработчик кнопок
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('category-filter');

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      // Снимаем выделение со всех
      document.querySelectorAll('.category-btn').forEach(btn =>
        btn.classList.remove('active')
      );

      // Добавляем активность текущей
      e.target.classList.add('active');

      // Загружаем новости по выбранной категории
      const category = e.target.dataset.category;
      getNews(category);
    }
  });

  // Загружаем "Все" по умолчанию
  getNews();
});


