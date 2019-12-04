import { observer, Provider } from "mobx-react";
import * as React from "react";
import { HashRouter, Redirect, Route } from "react-router-dom";
import styled from "styled-components";
import { MaterialColors } from "./Components/HelperComponents";
import Navigation from "./Components/Navigation";
import DateTimeStore from "./Components/Stores/DateTimeStore";
import LightsStore from "./Components/Stores/LightsStore";
import MusicStore from "./Components/Stores/MusicStore";
import SensorStore from "./Components/Stores/SensorStore";
import SystemStore from "./Components/Stores/SystemStore";
import WeatherStore from "./Components/Stores/WeatherStore";
import { StyledSystemSection } from "./Components/SystemSection";
import LightsScreen from "./Screens/LightsScreen";
import MusicScreen from "./Screens/MusicScreen";
import SensorScreen from "./Screens/SensorScreen";
import SystemScreen from "./Screens/SystemScreen";
import TimerScreen from "./Screens/TimerScreen";
import GPIOSensorService from "./Services/GPIOSensorService";
import PIDHumidityService from "./Services/PIDHumidityService";
import IHumidityService from "./Services/Interfaces/IHumidityService";
import ILightsService from "./Services/Interfaces/ILightsService";
import { ISensorService } from "./Services/Interfaces/ISensorService";
import ISystemService from "./Services/Interfaces/ISystemService";
import ITemperatureService from "./Services/Interfaces/ITemperatureService";
import LEDLightsService from "./Services/LEDLightsService";
import PIDTemperatureService from "./Services/PIDTemperatureService";
import SystemService from "./Services/SystemService";
import IMusicService from "./Services/Interfaces/IMusicService";
import SpeakerMusicService from "./Services/SpeakerMusicService";
import {IEnergyCountingService} from "./Services/Interfaces/IEnergyCountingService";
import {EnergyCountingService} from "./Services/EnergyCountingService";
import HysteresisTemperatureService from "./Services/HysteresisTemperatureService";
import HysteresisHumidityService from "./Services/HysteresisHumidityService";

interface IAppProps {
  className?: string;
}

const StyledNavigation = styled(Navigation)`
  width: 100%;

  td {
    text-align: center;
    vertical-align: middle;
  }
`;

@observer
class App extends React.Component<IAppProps, {}> {
  private systemService: ISystemService = new SystemService();
  private sensorService: ISensorService = new GPIOSensorService(
    this.systemService
  );
  private energyCountingService: IEnergyCountingService = new EnergyCountingService(this.sensorService);
  private temperatureService: ITemperatureService = new HysteresisTemperatureService(
    this.sensorService
  );
  private humidityService: IHumidityService = new HysteresisHumidityService(
    this.sensorService
  );
  private lightsService: ILightsService = new LEDLightsService(
    this.sensorService,
    this.systemService
  );
  private musicService: IMusicService = new SpeakerMusicService();

  private stores = {
    dateTimeStore: new DateTimeStore(),
    lightsStore: new LightsStore(this.lightsService, this.systemService),
    musicStore: new MusicStore(this.musicService),
    sensorStore: new SensorStore(
      this.temperatureService,
      this.humidityService,
      this.sensorService,
      this.systemService
    ),
    systemStore: new SystemStore(this.systemService, this.sensorService, this.energyCountingService),
    weatherStore: new WeatherStore()
  };

  public render(): React.ReactNode {
    let timerscreen = <TimerScreen lightService={this.lightsService} />;
    let screen = (
      <div>
        <Route exact path="/" render={() => <Redirect to="/system" />} />
        <Route
          path="/system"
          render={() => (
            <SystemScreen
              dateTimeStore={this.stores.dateTimeStore}
              weatherStore={this.stores.weatherStore}
            />
          )}
        />
        <Route path="/lights" component={LightsScreen} />
        <Route path="/sensors" component={SensorScreen} />
        <Route
          path="/timers"
          render={() => timerscreen}
        />
        <Route path="/music" component={MusicScreen} />
      </div>
    );

    if (!this.stores.systemStore.isOn) {
      screen = (
        <SystemScreen
          dateTimeStore={this.stores.dateTimeStore}
          weatherStore={this.stores.weatherStore}
        />
      );
    }

    return (
      <HashRouter>
        <Provider {...this.stores}>
          <div className={this.props.className}>
            {screen}
            <div className="AppFooter">
              <StyledSystemSection />
              <StyledNavigation iconSize={50} />
            </div>
          </div>
        </Provider>
      </HashRouter>
    );
  }
}

export default styled(App)`
    background-color: ${MaterialColors.black};
    color: ${MaterialColors.white};
    position: absolute;
    overflow: none;
    font-weight: lighter;
    padding: 10px 0px;
    padding-top: 30px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    font-family: sans-serif;
    user-select: none;

    div.AppFooter {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0
        padding: 5px 0px;
        width: 100%;
    }
`;
