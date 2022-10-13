import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store';

const DeleteSongModal = () => {
  const { store } = useContext(GlobalStoreContext);
  const hideDeleteSongModal = () => {
    let modal = document.getElementById('delete-song-modal');
    modal.classList.remove('is-visible');
  };
  const handleDeleteSong = () => {
    store.deleteSong(store.selectedSongIdx);
    hideDeleteSongModal();
  };
  return (
    <div class='modal' id='delete-song-modal' data-animation='slideInOutLeft'>
      <div class='modal-root' id='verify-delete-song-root'>
        <div class='modal-north'>Remove song?</div>
        <div class='modal-center'>
          <div class='modal-center-content'>
            Are you sure you wish to permanently delete the song?
          </div>
        </div>
        <div class='modal-south'>
          <input
            type='button'
            id='delete-song-confirm-button'
            class='modal-button'
            onClick={handleDeleteSong}
            value='Confirm'
          />
          <input
            type='button'
            id='delete-song-cancel-button'
            class='modal-button'
            onClick={hideDeleteSongModal}
            value='Cancel'
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteSongModal;
