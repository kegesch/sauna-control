export class Gpio {
  public static HIGH = 1;
  public static LOW = 0;

  constructor(gpio, direction) {}

  public read(callback) {
    callback();
  }

  public readSync() {
    return 1;
  }

  public write(value, callback) {
    callback();
  }

  public writeSync(value) {}

  public watch(callback) {}

  public unwatch(callback) {}

  public unwatchAll() {}

  public direction() {
    return undefined;
  }

  public setDirection(direction) {}

  public edge() {
    return undefined;
  }

  public setEdge(edge) {}

  public activeLow() {
    return false;
  }

  public setActiveLow(invert) {}

  public unexport() {}

  static get accessible() {
    return true;
  }
}
