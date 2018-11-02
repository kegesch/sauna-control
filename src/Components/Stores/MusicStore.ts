import {action, observable} from "mobx";
import Music from "../../Model/Music";

export default class MusicStore {

    @observable public volume: number = 100;
    @observable public musicFiles: Music[];

    @action
    public setVolume(volume: number) {
        if (volume < 0 || volume > 100) { return; }

        this.volume = volume;
    }

    public playMusic(musicFile: Music) {
      console.log("playing music " + musicFile.getName());
    }
}
