import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import {
  BigInfo,
  MaterialColors,
  SectionHeader
} from "../Components/HelperComponents";
import Icon from "../Components/Icon";
import DateTimeStore from "../Components/Stores/DateTimeStore";
import WeatherStore from "../Components/Stores/WeatherStore";

interface ISystemScreenProps {
  className?: string;
  dateTimeStore: DateTimeStore;
  weatherStore: WeatherStore;
}

const DateInfo = styled(BigInfo)`
  font-size: 5em;
  margin-top: 30px;
`;
const TempInfo = styled(BigInfo)`
  font-size: 8em;
`;

@inject("dateTimeStore", "weatherStore")
@observer
export default class SystemScreen extends React.Component<
  ISystemScreenProps,
  {}
> {
  public render() {
    return (
      <div>
        <SectionHeader label="Zeit / Temperatur" unit="LOKAL" />
        <DateInfo>{this.props.dateTimeStore.date}</DateInfo>
        <BigInfo>{this.props.dateTimeStore.time}</BigInfo>
        <TempInfo>
          <Icon name="mapmarker" size={70} color={MaterialColors.white} />
          {this.props.weatherStore.currentTemp}°C
        </TempInfo>
      </div>
    );
  }
}
