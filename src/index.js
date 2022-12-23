import ImageApiService from './js/imageApiService';
import LoadMoreButton from './js/loadMoreButton';
import { getRefs } from './js/getRefs';
import { renderMarkup, clear } from './js/renderMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
const imageApiService = new ImageApiService();
const loadMoreButton = new LoadMoreButton({
  selector: '.load-more',
  hidden: true,
});
const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchFormEl.addEventListener('submit', onSearch);
loadMoreButton.refs.button.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (imageApiService.query === '') {
    Notify.info('Sorry, but something needs to be entered.');
    return;
  }

  imageApiService.resetPage();
  clear();

  try {
    const { hits, totalHits } = await imageApiService.getImages();

    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.hide();
      return;
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      renderMarkup(hits);
      loadMoreButton.show();
      lightBox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  loadMoreButton.disable();

  try {
    const { hits, totalHits } = await imageApiService.getImages();

    if (hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      renderMarkup(hits);
      loadMoreButton.hide();
    }

    renderMarkup(hits);
    scroll();
    loadMoreButton.enable();
    lightBox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.8,
    behavior: 'smooth',
  });
}
