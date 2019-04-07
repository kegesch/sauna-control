export default class Music {

  private _name: string;
  private _filepath: string;
  private _duration: number;

  constructor(name: string, filepath: string, duration: number) {
    this._name = name;
    this._duration = duration;
    this._filepath = filepath;
  }

  get filepath(): string {
    return this._filepath;
  }

  get name(): string {
    return this._name;
  }

  get duration(): number {
    return this._duration;
  }
}
