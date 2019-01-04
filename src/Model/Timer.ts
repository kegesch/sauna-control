export default class Timer {
  public onEnd?: () => void;

  private time: number;
  private timer: any;

  constructor(seconds: number, onEnd?: () => void) {
    this.time = seconds;
    this.onEnd = onEnd;
  }

  public setTimer(): void {
    this.timer = setInterval(() => {
      this.time--;
      if (this.time <= 0) {
        clearInterval(this.timer);
        this.onEnd();
      }
    }, 1000);
  }

  public stopTimer(): void {
    clearInterval(this.timer);
  }
}
