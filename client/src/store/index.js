import { createContext, useState } from 'react';
import jsTPS from '../common/jsTPS';
import api from '../api';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: 'CHANGE_LIST_NAME',
  CLOSE_CURRENT_LIST: 'CLOSE_CURRENT_LIST',
  CREATE_NEW_LIST: 'CREATE_NEW_LIST',
  LOAD_ID_NAME_PAIRS: 'LOAD_ID_NAME_PAIRS',
  SET_CURRENT_LIST: 'SET_CURRENT_LIST',
  SET_LIST_NAME_EDIT_ACTIVE: 'SET_LIST_NAME_EDIT_ACTIVE',
  SELECT_LIST_TO_DELETE: 'SELECT_LIST_TO_DELETE',
  SELECT_SONG: 'SELECT_SONG',
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    newListCounter: 0,
    listNameActive: false,
    selectedListId: '',
    selectedSongIdx: -1,
  });

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: payload.playlist,
          newListCounter: store.newListCounter,
          listNameActive: false,
          selectedListId: '',
          selectedSongIdx: -1,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          selectedListId: '',
          selectedSongIdx: -1,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter + 1,
          listNameActive: false,
          selectedListId: '',
          selectedSongIdx: -1,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload,
          currentList: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          selectedListId: '',
          selectedSongIdx: -1,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          selectedListId: '',
          selectedSongIdx: -1,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          listNameActive: false,
          selectedListId: '',
          selectedSongIdx: -1,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          listNameActive: true,
          selectedListId: '',
          selectedSongIdx: -1,
        });
      }
      // SELECT LIST TO DELETE
      case GlobalStoreActionType.SELECT_LIST_TO_DELETE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          selectedListId: payload,
          selectedSongIdx: -1,
        });
      }
      case GlobalStoreActionType.SELECT_SONG: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          listNameActive: false,
          selectedListId: '',
          selectedSongIdx: payload,
        });
      }
      default:
        return store;
    }
  };
  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        playlist.name = newName;
        async function updateList(playlist) {
          response = await api.updatePlaylistById(playlist._id, playlist);
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await api.getPlaylistPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    playlist: playlist,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        updateList(playlist);
      }
    }
    asyncChangeListName(id);
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = function () {
    async function asyncLoadIdNamePairs() {
      const response = await api.getPlaylistPairs();
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: pairsArray,
        });
      } else {
        console.log('API FAILED TO GET THE LIST PAIRS');
      }
    }
    asyncLoadIdNamePairs();
  };

  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;

        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: playlist,
          });
          store.history.push('/playlist/' + playlist._id);
        }
      }
    }
    asyncSetCurrentList(id);
  };
  store.getPlaylistSize = function () {
    return store.currentList.songs.length;
  };
  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setListNameActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  // THIS FUNCTION ADDS A NEW PLAYLIST
  store.createNewList = () => {
    const playlist = { name: 'untitled', songs: [] };
    const asyncCreateNewList = async () => {
      const response = await api.createPlaylist(playlist);
      if (response.data.success) {
        let playlist = response.data.playlist;

        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: playlist,
          });
          store.history.push('/playlist/' + playlist._id);
        }
      }
    };
    asyncCreateNewList();
  };

  store.selectListToDelete = (id) => {
    storeReducer({
      type: GlobalStoreActionType.SELECT_LIST_TO_DELETE,
      payload: id,
    });
  };

  store.deletePlaylist = (id) => {
    // GET THE LIST
    async function asyncDeletePlaylist(id) {
      let response = await api.getPlaylistById(id);
      let playlist = response.data.playlist;
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
          payload: {},
        });
        async function deleteList(playlist) {
          response = await api.deletePlaylistById(playlist._id);
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await api.getPlaylistPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    playlist: playlist,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        deleteList(playlist);
      }
    }
    asyncDeletePlaylist(id);
  };

  store.moveSong = (start, end) => {
    const list = store.currentList;
    if (start < end) {
      let temp = list.songs[start];
      for (let i = start; i < end; i++) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    } else if (start > end) {
      let temp = list.songs[start];
      for (let i = start; i > end; i--) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }
    async function asyncUpdatePlaylist(playlist) {
      let response = await api.updatePlaylistById(playlist._id, playlist);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: response.data.playlist,
        });
      }
    }

    asyncUpdatePlaylist(list);
  };

  store.selectSong = (idx) => {
    storeReducer({
      type: GlobalStoreActionType.SELECT_SONG,
      payload: idx,
    });
  };

  store.deleteSong = (idx) => {
    const list = store.currentList;
    list.songs.splice(idx, 1);
    async function asyncUpdatePlaylist(playlist) {
      let response = await api.updatePlaylistById(playlist._id, playlist);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: response.data.playlist,
        });
      }
    }

    asyncUpdatePlaylist(list);
  };

  store.addSong = (title, artist, youTubeId) => {
    const list = store.currentList;
    const song = { title: title, artist: artist, youTubeId: youTubeId };
    list.songs.push(song);
    async function asyncUpdatePlaylist(playlist) {
      let response = await api.updatePlaylistById(playlist._id, playlist);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: response.data.playlist,
        });
      }
    }

    asyncUpdatePlaylist(list);
  };

  store.editSong = (editedSong) => {
    const list = store.currentList;
    let song = list.songs[store.selectedSongIdx];
    song.title = editedSong.title;
    song.artist = editedSong.artist;
    song.youTubeId = editedSong.youTubeId;
    async function asyncUpdatePlaylist(playlist) {
      let response = await api.updatePlaylistById(playlist._id, playlist);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: response.data.playlist,
        });
      }
    }
    asyncUpdatePlaylist(list);
  };

  // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
  return { store, storeReducer };
};
