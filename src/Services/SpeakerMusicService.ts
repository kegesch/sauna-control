import IMusicService from "./Interfaces/IMusicService";
import Music from "../Model/Music";
import * as fs from "fs";
const id3 = require("node-id3");
// @ts-ignore
import * as lame from 'lame';
// @ts-ignore
import Speaker from 'speaker';

export default class SpeakerMusicService implements IMusicService {

  private decoder: lame.Lame;
  private speaker: Speaker;

  constructor() {
  }

  public async getMusicFiles(): Promise<Music[]> {
    return new Promise<Music[]>(((resolve, reject) => {
      const searchPath = "assets/music/";
      try {
        fs.readdir(searchPath, (err, files) => {
          let music: Music[] = [];
          files.forEach(file => {
            let tags = id3.read(searchPath + file);
            console.log(tags);
            music.push(new Music(tags.artist, tags.title, searchPath + file));
          });
          resolve(music);
        })
      } catch(err) {
        reject(err);
      }
    }));

  }

  playMusic(music: Music, repeat: boolean): void {
    let audioOptions = {channels: 2, bitDepth: 16, sampleRate: 44100};
    this.decoder = new lame.Decoder();
    this.speaker = new Speaker(audioOptions);

    fs.createReadStream(music.filePath)
      .pipe(this.decoder).pipe(this.speaker);
  }

  stopMusic(): void {
    this.decoder.unpipe();
    this.speaker.close();
  }

}
