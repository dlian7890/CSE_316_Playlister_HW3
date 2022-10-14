import jsTPS_Transaction from '../common/jsTPS.js';
/**
 * AddSong_Transaction
 *
 * This class represents a transaction that adds a song to the
 * current playlist. It will be managed by the transaction stack.
 *
 * @author DongPing Lian
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
  constructor(store) {
    super();
    this.store = store;
  }

  doTransaction() {
    this.store.addSong('Untitled', 'Unknown', 'dQw4w9WgXcQ');
  }

  undoTransaction() {
    this.store.deleteSong(this.store.getPlaylistSize() - 1);
  }
}
