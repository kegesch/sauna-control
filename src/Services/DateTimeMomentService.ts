import * as moment from "moment";
import { IDateTimeService } from "./Interfaces/IDateTimeService";

export class DateTimeMomentService implements IDateTimeService {
  private DATEFORMAT: string = "DD.MM.YYYY";
  private TIMEFORMAT: string = "HH:mm";

  public getCurrentTime(): string {
    return moment().format(this.TIMEFORMAT);
  }

  public getCurrentDate(): string {
    return moment().format(this.DATEFORMAT);
  }
}
