export default class Music {

  private _name: string;
  private _filepath: string;

  constructor(name: string, filepath: string) {
    this._name = name;
    this._filepath = filepath;
  }

  get filepath(): string {
    return this._filepath;
  }

  get name(): string {
    return this._name;
  }
}
