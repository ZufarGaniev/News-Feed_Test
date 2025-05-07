/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'; // расширенные матчеры
import getNews from '../src/getNewsFetch.js';

describe('getNews', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Подготавливаем контейнер, в который renderNews вставляет карточки
    document.body.innerHTML = `<div id="news-container"></div>`;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // Восстанавливаем fetch и очищаем моки
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('вызывает fetch с category=top по умолчанию и рендерит полученные новости', async () => {
    const fakeResults = [{
      urlToImage: 'img.jpg',
      title: 'Тест',
      description: 'Описание',
      url: 'http://example.com',
    }];

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: fakeResults }),
    });

    await getNews(); // default category = 'top'

    // Проверяем правильный URL
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('category=top')
    );

    // Проверяем, что карточка появилась в #news-container
    const cards = document.querySelectorAll('.news-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Тест');
  });

  it('вызывает fetch без параметра category для "all" и рендерит все новости', async () => {
    const fakeResults = [{
      urlToImage: 'img2.jpg',
      title: 'Все новости',
      description: '',
      url: 'http://example.org',
    }];

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: fakeResults }),
    });

    await getNews('all');

    // URL не должен содержать "&category="
    expect(fetch).toHaveBeenCalledWith(
      expect.not.stringContaining('category=')
    );

    // Карточка появилась
    const card = document.querySelector('.news-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Все новости');
  });

  it('показывает сообщение при пустом массиве результатов', async () => {
    // Имитируем API, вернувший пустые results
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: [] }),
    });

    await getNews('sports');

    const container = document.getElementById('news-container');
    expect(container).toHaveTextContent(
      'Нет новостей по выбранной категории.'
    );
  });

  it('показывает сообщение при ошибке сети', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await getNews('politics');

    const container = document.getElementById('news-container');
    expect(container).toHaveTextContent(
      'Нет новостей по выбранной категории.'
    );
  });
});
