import './App.css';
import { React } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Banner, ListSelector, PlaylistCards, Statusbar } from './components';
import DeleteListModal from './components/DeleteListModal';
import DeleteSongModal from './components/DeleteSongModal';
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
  const showDeleteListModal = () => {
    let modal = document.getElementById('delete-list-modal');
    modal.classList.add('is-visible');
  };
  // THIS FUNCTION IS FOR HIDING THE MODAL
  const hideDeleteListModal = () => {
    let modal = document.getElementById('delete-list-modal');
    modal.classList.remove('is-visible');
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO EDIT THE SONG
  const showEditSongModal = () => {
    let modal = document.getElementById('edit-song-modal');
    modal.classList.add('is-visible');
  };
  // THIS FUNCTION IS FOR HIDING THE MODAL
  const hideEditSongModal = () => {
    let modal = document.getElementById('edit-song-modal');
    modal.classList.remove('is-visible');
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO REMOVE THE SONG
  const showDeleteSongModal = () => {
    let modal = document.getElementById('delete-song-modal');
    modal.classList.add('is-visible');
  };
  // THIS FUNCTION IS FOR HIDING THE MODAL
  const hideDeleteSongModal = () => {
    let modal = document.getElementById('delete-song-modal');
    modal.classList.remove('is-visible');
  };
  return (
    <Router>
      <Banner />
      <Switch>
        <Route path='/' exact component={ListSelector} />
        <Route path='/playlist/:id' exact component={PlaylistCards} />
      </Switch>
      <Statusbar />
      <DeleteListModal />
      <DeleteSongModal />
    </Router>
  );
};

export default App;
