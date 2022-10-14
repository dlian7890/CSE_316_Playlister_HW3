import jsTPS_Transaction from '../common/jsTPS.js';
/**
 * RemoveSong_Transaction
 *
 * This class represents a transaction that removes a song at the index
 *  of the current playlist. It will be managed by the transaction stack.
 *
 * @author DongPing Lian
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
  constructor(store, songIdx) {
    super();
    this.store = store;
    this.songIdx = songIdx;
  }

  doTransaction() {
    this.removedSong = this.store.deleteSong(this.songIdx);
  }

  undoTransaction() {
    this.store.addSong(this.songIdx, this.removedSong);
  }
}
