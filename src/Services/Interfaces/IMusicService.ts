import Music from "../../Model/Music";

export default interface IMusicService {
  getMusicFiles(): Promise<Music[]>
  playMusic(music: Music, repeat: boolean): void;
  stopMusic(): void;
}
