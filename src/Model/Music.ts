export default class Music {
  private name: string;
  private filepath: string;

  constructor(name: string, filepath: string) {
    this.name = name;
    this.filepath = filepath;
  }

  public getName(): string {
    return this.name;
  }

  public getFilePath(): string {
    return this.filepath;
  }
}
