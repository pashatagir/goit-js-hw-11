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

function onSearch(e) {
  e.preventDefault();
  imageApiService.query = e.currentTarget.elements.searchQuery.value;
  imageApiService.resetPage();
  clear();
  imageApiService.getImages().then(({ hits, totalHits }) => {
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.hide();
      return;
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    renderMarkup(hits);
    loadMoreButton.show();
    lightBox.refresh();
  });
}

function onLoadMore() {
  loadMoreButton.disable();
  imageApiService.getImages().then(({ hits, totalHits }) => {
    if (hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      renderMarkup(hits);
      loadMoreButton.hide();
      return;
    }
    renderMarkup(hits);
    loadMoreButton.enable();
    lightBox.refresh();
  });
}
