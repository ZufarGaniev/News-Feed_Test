import renderNews from './renderNews';

const API_KEY = 'pub_8501869c09275ad14ce7a068052c754a53d05';

async function getNews(category = 'top') {
  const url = category === 'all'
    ? `https://newsdata.io/api/1/news?country=ru&language=ru&apikey=${API_KEY}`
    : `https://newsdata.io/api/1/news?country=ru&language=ru&category=${category}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const articles = data.results || [];
    renderNews(articles);
  } catch (err) {
    console.error('Ошибка при получении новостей:', err);
    renderNews([]); // пустой вывод
  }
}

// Обработчик кнопок
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('category-filter');

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      document.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
      e.target.classList.add('active');

      const { category } = e.target.dataset;
      getNews(category);
    }
  });

  getNews(); // Загрузить "top" по умолчанию
});

export default getNews;
