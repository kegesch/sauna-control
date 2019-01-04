import { DateTimeMomentService } from "../../Services/DateTimeMomentService";
import { IDateTimeService } from "../../Services/Interfaces/IDateTimeService";
import { action, observable } from "mobx";

export default class DateTimeStore {
  @observable
  public date: string;

  @observable
  public time: string;

  private timer: any;

  private dateTimeService: IDateTimeService = new DateTimeMomentService();

  constructor() {
    this.start();
  }

  private start() {
    this.timer = setInterval(() => {
      this.setCurrentDateTime();
    }, 1000);
  }

  @action
  private setCurrentDateTime() {
    this.date = this.dateTimeService.getCurrentDate();
    this.time = this.dateTimeService.getCurrentTime();
  }
}
