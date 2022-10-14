import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import SongCard from './SongCard.js';
import { GlobalStoreContext } from '../store';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();
  const handleUndoRedo = (event) => {
    let canUndo = store.canUndo();
    let canRedo = store.canRedo();
    if (event.ctrlKey) {
      if (event.keyCode === 90) {
        event.preventDefault();
        if (canUndo) store.undo();
      } else if (event.keyCode === 89) {
        event.preventDefault();
        if (canRedo) store.redo();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleUndoRedo);
    return () => {
      document.removeEventListener('keydown', handleUndoRedo);
    };
  });

  return (
    <div id='playlist-cards'>
      {store.currentList.songs.map((song, index) => (
        <SongCard
          id={'playlist-song-' + index}
          key={'playlist-song-' + index}
          index={index}
          song={song}
        />
      ))}
    </div>
  );
}

export default PlaylistCards;
