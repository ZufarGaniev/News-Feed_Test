import '@testing-library/jest-dom';
import getNews from '../src/getNewsFetch.js';

describe('getNews', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Эмулируем DOM, как в HTML
    document.body.innerHTML = `
      <main class="news__card" id="news-container">
        <div class="grid" id="grid-container"></div>
      </main>
    `;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('вызывает fetch с category=top по умолчанию и рендерит новости', async () => {
    const fakeResults = [{
      image_url: 'img.jpg',
      title: 'Тестовая новость',
      description: 'Описание новости',
      link: 'http://example.com',
    }];

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: fakeResults }),
    });

    await getNews(); // category = 'top'

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('category=top'));

    const cards = document.querySelectorAll('.news-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Тестовая новость');
    expect(cards[0]).toHaveTextContent('Описание новости');
  });

  it('вызывает fetch без параметра category для "all" и рендерит новости', async () => {
    const fakeResults = [{
      image_url: 'img2.jpg',
      title: 'Все новости',
      description: '',
      link: 'http://example.org',
    }];

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: fakeResults }),
    });

    await getNews('all');

    expect(fetch).toHaveBeenCalledWith(expect.not.stringContaining('category='));

    const card = document.querySelector('.news-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Все новости');
  });

  it('показывает сообщение при пустом массиве результатов', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ results: [] }),
    });

    await getNews('sports');

    const container = document.getElementById('grid-container');
    expect(container).toHaveTextContent(
      'Нет новостей с изображениями по выбранной категории.',
    );
  });

  it('показывает сообщение при ошибке сети', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    await getNews('politics');

    const container = document.getElementById('grid-container');
    expect(container).toHaveTextContent(
      'Нет новостей с изображениями по выбранной категории.',
    );
  });
});
