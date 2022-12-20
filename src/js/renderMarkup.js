import { getRefs } from './getRefs';

const refs = getRefs();

function createImageElement(hits) {
  return hits
    .map(
      hits => `<div class='photo-card'>
    <a href=${hits.largeImageURL}><img src=${hits.webformatURL} alt=${hits.tags} loading="lazy" width="270px" height="180px"/></a>
    <div class='info'>
      <p class='info-item'>
        <b>Likes: ${hits.likes}</b>
      </p>
      <p class='info-item'>
        <b>Views: ${hits.views}</b>
      </p>
      <p class='info-item'>
        <b>Comments: ${hits.comments}</b>
      </p>
      <p class='info-item'>
        <b>Downloads: ${hits.downloads}</b>
      </p>
    </div>
  </div>`
    )
    .join('');
}

function renderMarkup(hits) {
  refs.imagesContainerEl.insertAdjacentHTML(
    'beforeend',
    createImageElement(hits)
  );
}

function clear() {
  refs.imagesContainerEl.innerHTML = '';
}

export { renderMarkup, clear };
