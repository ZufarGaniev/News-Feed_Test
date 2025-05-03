import { renderNews } from '../src/renderNews';

const { renderNews } = require('../src/renderNews');

describe('renderNews', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="news-container"></div>';
  });

  it('должен отобразить карточку с изображением', () => {
    const articles = [
      { title: 'Новость 1', description: 'Описание', url: '#', urlToImage: 'img.jpg' }
    ];

    renderNews(articles);

    const cards = document.querySelectorAll('.news-card');
    expect(cards.length).toBe(1);
    expect(cards[0].innerHTML).toContain('Новость 1');
    expect(cards[0].innerHTML).toContain('<img>');
  });

  it('должен пропустить новости без изображения', () => {
    const articles = [
      { title: 'Новость без картинки', description: '', url: '#', urlToImage: null }
    ];

    renderNews(articles);

    const cards = document.querySelectorAll('.news-card');
    expect(cards.length).toBe(0);
  });

  it('должен показать сообщение при пустом списке', () => {
    renderNews([]);

    const container = document.getElementById('news-container');
    expect(container.innerHTML).toContain('Нет новостей');
  });
});

module.exports = { renderNews };