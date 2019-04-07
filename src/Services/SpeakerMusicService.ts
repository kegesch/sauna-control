import IMusicService from "./Interfaces/IMusicService";
import Music from "../Model/Music";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {setMaxListeners} from "cluster";
const player = require('play-sound')({});
const kill = require('tree-kill');

export default class SpeakerMusicService implements IMusicService {

  private audio: any;

  constructor() {
  }

  public async getMusicFiles(): Promise<Music[]> {
    return new Promise<Music[]>(((resolve, reject) => {
      const homedir = os.homedir();
      const searchPath = homedir+"/music/";
      console.log("searching music in " + searchPath);

      try {
        fs.readdir(searchPath, (err, files) => {
          let music: Music[] = [];

          files = files.filter(v => path.extname(v) == '.mp3');
          files.forEach((file)  => {
              const filename = file.split(".")[0];
              const split = filename.split(" - ");
              const songname = split[0];
              const duration = parseInt(split[1]);
              music.push(new Music(songname, searchPath + file, duration));
            }
          );
          resolve(music);
        })
      } catch(err) {
        reject(err);
      }
    }));

  }

  playMusic(music: Music, repeat: boolean): void {
    this.audio = player.play(music.filepath, function(err: any){
      if (err) throw err;
    })

  }

  stopMusic(): void {
    kill(this.audio.pid);
  };

}
