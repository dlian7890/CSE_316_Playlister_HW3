import jsTPS_Transaction from '../common/jsTPS.js';
/**
 * EditSong_Transaction
 *
 * This class represents a transaction that edit a song in the
 * current playlist. It will be managed by the transaction stack.
 *
 * @author DongPing Lian
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
  constructor(store, songIdx, uneditedSong, editedSong) {
    super();
    this.store = store;
    this.songIdx = songIdx;
    this.uneditedSong = uneditedSong;
    this.editedSong = editedSong;
  }

  doTransaction() {
    this.store.editSong(this.songIdx, this.editedSong);
  }

  undoTransaction() {
    this.store.editSong(this.songIdx, this.uneditedSong);
  }
}
