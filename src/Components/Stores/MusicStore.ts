import {action, flow, observable} from "mobx";
import Music from "../../Model/Music";
import IMusicService from "../../Services/Interfaces/IMusicService";

export default class MusicStore {
  @observable public volume: number = 100;
  @observable public musicFiles: Music[];
  @observable public isPlaying: boolean = false;

  private musicService: IMusicService;

  constructor(musicService: IMusicService) {
    this.musicService = musicService;

    this.refreshFiles();
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
      console.log("playing music " + musicFile.title);
      this.musicService.playMusic(musicFile, true);
    } else {
      console.log("stopping music");
      this.musicService.stopMusic();
    }
    this.isPlaying = !this.isPlaying;
  }
}
