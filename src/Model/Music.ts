export default class Music {

  private _artist: string;
  private _title: string;
  private _filepath: string;

  constructor(artist: string, title: string, filepath: string) {
    this._title = title;
    this._artist = artist;
    this._filepath = filepath;
  }

  get artist(): string {
    return this._artist;
  }

  get title(): string {
    return this._title;
  }

  get filePath(): string {
    return this._filepath;
  }
}
