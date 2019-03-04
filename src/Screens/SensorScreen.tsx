import { inject, observer } from "mobx-react";
import * as React from "react";
import { BigInfo, SectionHeader } from "../Components/HelperComponents";
import SensorStore from "../Components/Stores/SensorStore";

interface ISensorScreenProperties {
  className?: string;
  sensorStore: SensorStore;
}

@inject("sensorStore")
@observer
export default class SensorScreen extends React.Component<
  ISensorScreenProperties,
  {}
> {

  public render() {
    return (
      <div className={this.props.className}>
        <div
          onClick={() => {
            this._selectSetPoint("temp");
          }}
        >
          <SectionHeader
            label="Temperatur"
            value={this.props.sensorStore.currentTemp + ""}
            unit="°C"
          />
          <BigInfo
            selected={this.props.sensorStore.selectedSetPoint === "temp"}
          >
            {this.props.sensorStore.setPointTemp}
          </BigInfo>
        </div>
        <div
          onClick={() => {
            this._selectSetPoint("humid");
          }}
        >
          <SectionHeader
            label="Feuchtigkeit"
            value={this.props.sensorStore.currentHumid + ""}
            unit="%"
          />
          <BigInfo
            selected={this.props.sensorStore.selectedSetPoint === "humid"}
          >
            {this.props.sensorStore.setPointHumid}
          </BigInfo>
        </div>
      </div>
    );
  }

  private _selectSetPoint(setPoint: "temp" | "humid") {
    const selected = this.props.sensorStore.selectedSetPoint;

    let select: "temp" | "humid" | null = null;
    if (selected !== setPoint) {
      select = setPoint;
    }

    this.props.sensorStore.selectSetPoint(select);
  }
}
