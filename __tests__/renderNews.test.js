/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'; // расширенные матчеры
import renderNews from '../src/renderNews';

describe('renderNews', () => {
  beforeEach(() => {
    // Подготавливаем чистый контейнер в DOM
    document.body.innerHTML = `
      <main>
        <div id="news-container"></div>
      </main>
    `;
  });

  it('показывает сообщение при пустом массиве', () => {
    const container = document.getElementById('news-container');
    renderNews([]);
    expect(container).toHaveTextContent('Нет новостей по выбранной категории.');
  });

  it('пропускает статьи без изображения', () => {
    const container = document.getElementById('news-container');
    const articles = [
      { title: 'Статья A', url: 'http://a', urlToImage: '' },
      { title: 'Статья B', url: 'http://b' }, // urlToImage отсутствует
    ];
    renderNews(articles);
    const cards = container.querySelectorAll('.news-card');
    expect(cards.length).toBe(0);
  });

  it('рендерит карточку для статьи с картинкой', () => {
    const container = document.getElementById('news-container');
    const articles = [{
      title: 'Заголовок',
      description: 'Описание статьи',
      url: 'http://example.com',
      urlToImage: 'http://example.com/image.jpg',
    }];

    renderNews(articles);

    // Должна быть ровно одна карточка
    const cards = container.querySelectorAll('.news-card');
    expect(cards).toHaveLength(1);

    const card = cards[0];
    const img = card.querySelector('img.news-image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Image');

    const titleEl = card.querySelector('h3');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('Заголовок');

    const descEl = card.querySelector('p');
    expect(descEl).toBeInTheDocument();
    expect(descEl).toHaveTextContent('Описание статьи');

    const link = card.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveTextContent('Читать далее');
  });

  it('подставляет заглушку, если description отсутствует', () => {
    const container = document.getElementById('news-container');
    const articles = [{
      title: 'Без описания',
      url: 'http://no-desc',
      urlToImage: 'http://example.com/img.jpg',
      // description отсутствует
    }];

    renderNews(articles);

    const descEl = container.querySelector('.news-card p');
    expect(descEl).toHaveTextContent('Описание отсутствует');
  });
});
