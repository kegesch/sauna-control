import {action, computed, flow, observable} from "mobx";
import Music from "../../Model/Music";
import IMusicService from "../../Services/Interfaces/IMusicService";

export default class MusicStore {
  @observable public volume: number = 100;
  @observable public musicFiles: Music[];
  @observable public currentMusic: Music = undefined;

  private musicService: IMusicService;

  constructor(musicService: IMusicService) {
    this.musicService = musicService;

    this.refreshFiles();
  }

  @computed
  public get isPlaying() {
    return this.currentMusic !== undefined;
  }

  @action
  public setVolume(volume: number) {
    if (volume < 0 || volume > 100) {
      return;
    }

    this.volume = volume;
  }

  refreshFiles = flow(this.refreshFilesAsync);
  private * refreshFilesAsync() {
    this.musicFiles = yield this.musicService.getMusicFiles();
    console.log(this.musicFiles);
  }

  @action
  public playMusic(musicFile: Music) {
    if(!this.isPlaying) {
      this.currentMusic = musicFile;
      this.musicService.playMusic(musicFile, true);
    } else {
      this.currentMusic = undefined;
      this.musicService.stopMusic();
    }
  }
}
