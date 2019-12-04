export default class Hysteresis {

  private lastValue: number = undefined;
  private target: number = undefined;
  private padding: number = 0;

  constructor(padding: number) {
    this.padding = padding;
  }

  public setTarget(target: number) {
    if (target)
      this.target = target;
  }

  public update(current: number): boolean {
    const upperBorder = this.target + this.padding;
    const lowerBorder = this.target - this.padding;

    if (!this.lastValue) {
      this.lastValue = current;
      return true;
    }

    const gradient = Math.sign(current - this.lastValue);

    if(current < upperBorder && gradient != -1) {
      return true;
    }

    if(current < lowerBorder && gradient != 1) {
      return true;
    }

    return false;
  }
}
