export function renderNews(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = '';
  
    if (!articles.length) {
      container.innerHTML = '<p>Нет новостей по выбранной категории.</p>';
      return;
    }
  
    articles.forEach((article) => {
      // пропускаем статьи без изображения
      if (!article.urlToImage) return;
  
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <img src="${article.urlToImage}" alt="Image" class="news-image">
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || 'Описание отсутствует'}</p>
          <a href="${article.url}" target="_blank">Читать далее</a>
        </div>
      `;
      container.appendChild(card);
    });
  }  