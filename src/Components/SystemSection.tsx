import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { MaterialColors, Separator } from "./HelperComponents";
import { BoxedIcon } from "./Icon";
import LightsStore from "./Stores/LightsStore";
import SensorStore from "./Stores/SensorStore";
import MusicStore from "./Stores/MusicStore";
import SystemStore from "./Stores/SystemStore";

interface ISystemSectionProps {
  className?: string;
  lightsStore?: LightsStore;
  sensorStore?: SensorStore;
  musicStore?: MusicStore;
  systemStore?: SystemStore;
}

const StyledIcon = styled(BoxedIcon)`
  margin: 5px;
  display: inline;
  fill: ${props =>
    props.isEnabled
      ? MaterialColors.green
      : props.isWarning
      ? MaterialColors.orange
      : MaterialColors.white};
`;

const EnergyCounter  = styled.div`
  margin-left: auto;
  line-height: 25px;
  color: ${MaterialColors.white}
`;

@inject("lightsStore", "sensorStore", "musicStore", "systemStore")
@observer
class SystemSection extends React.Component<ISystemSectionProps, {}> {
  public render() {
    return (
      <div className={this.props.className}>
        <Separator />
        <div style={{display: "flex"}}>
          <StyledIcon
            size={20}
            name="lightbulb"
            color={MaterialColors.white}
            isEnabled={this.props.lightsStore.isOn && !this.props.lightsStore.isAuto}
            isWarning={this.props.lightsStore.isAuto}
          />
          <StyledIcon
            size={25}
            name="tilde"
            color={MaterialColors.white}
            isEnabled={this.props.sensorStore.isHeating}
          />
          <StyledIcon
            size={20}
            name="tint"
            color={MaterialColors.white}
            isEnabled={this.props.sensorStore.isEvaporating}
          />
          <StyledIcon
            size={22}
            name="volume"
            color={MaterialColors.white}
            isEnabled={this.props.musicStore.isPlaying}
          />
          <EnergyCounter>{Math.round(this.props.systemStore.currentEnergyDemand)+" min"}</EnergyCounter>
        </div>
      </div>
    );
  }
}

export const StyledSystemSection = styled(SystemSection)`
  width: 80%;
  margin: 0px auto 10px auto;
`;
