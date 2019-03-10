import { inject, observer } from "mobx-react";
import * as React from "react";
import SensorStore from "../Components/Stores/SensorStore";
import SaunaMode from "../Components/SaunaMode";
import styled from "styled-components";
import Mode from "../Model/SaunaMode";
import SaunaModeScreen from "./SaunaModeScreen";

interface ISensorScreenProperties {
  className?: string;
  sensorStore: SensorStore;
}

const ScreenDiv = styled.div`
  flex: 1; 
  flex-direction: row;
  margin: 0 auto;
  padding: 0px 40px;
`;

@inject("sensorStore")
@observer
export default class SensorScreen extends React.Component<
  ISensorScreenProperties,
  {}
> {

  public render() {

    let screen =  null;

    if(this.props.sensorStore.selectedSaunaMode) {
      screen = <SaunaModeScreen sensorStore={this.props.sensorStore} saunaMode={this.props.sensorStore.selectedSaunaMode}/>

    } else {
      screen = <ScreenDiv className={this.props.className}>
        {
          this.props.sensorStore.saunaModes.map((mode: Mode) => <SaunaMode
            onClick={() => this.props.sensorStore.selectSaunaMode(mode)}
            key={mode.name}
            name={mode.name}
            minDegree={mode.minTemperature}
            maxDegree={mode.maxTemperature}
            minHumidity={mode.minHumidity}
            maxHumidity={mode.maxHumidity}
            imageIconSrc={mode.iconImage}
          />)
        }
      </ScreenDiv>;
    }

    return screen;
  }
}
