import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from './SearchImage/SearchImage';
import ImageGallery from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { animateScroll } from 'react-scroll';

export const App = () => {
  const [imageName, setImageName] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  //const [per_page, setParPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  //const [id, setId] = useState(null);
  const per_page = 12;

  useEffect(() => {
    getImages(imageName, page);
  }, [imageName, page]);

  const getImages = async (im, page) => {
    if (!im) {
      return;
    }
    setLoading(true);
    try {
      const { hits, totalHits } = await fetchImages(im, page);
      if (hits.length === 0) {
        return alert('Sorry, nothin found');
      }

      setImages(prevImages => [...prevImages, ...hits]);
      setLoadMore(page < Math.ceil(totalHits / per_page));
    } catch (error) {
      setError({ error });
      //this.setState({ error: error.message });
    } finally {
      setLoading(false);
      //this.setState({ loading: false });
    }
  };

  const handleFormSubmit = imageName => {
    setImageName(imageName);
    setImages([]);
    setPage(1);
    setLoadMore(false);
  };

  const onLoadMore = () => {
    setLoading(true);
    setPage(prevPage => prevPage + 1);
    //this.setState(prevState => ({ page: prevState.page + 1 }));
    scrollOnMoreButton();
  };

  const scrollOnMoreButton = () => {
    animateScroll.scrollToBottom({
      duration: 1000,
      delay: 10,
      smooth: 'linear',
    });
  };

  const openModal = largeImageURL => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />

      {loading ? (
        <Loader />
      ) : (
        <ImageGallery images={images} openModal={openModal} />
      )}

      {loadMore && <Button onLoadMore={onLoadMore} page={page} />}

      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </>
  );
};
