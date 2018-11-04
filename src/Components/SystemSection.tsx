import {inject, observer} from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import {MaterialColors, Separator} from "./HelperComponents";
import {BoxedIcon} from "./Icon";
import LightsStore from "./Stores/LightsStore";
import SensorStore from "./Stores/SensorStore";

interface ISystemSectionProps {
    className?: string;
    lightsStore?: LightsStore;
    sensorStore?: SensorStore;
}

const StyledIcon = styled(BoxedIcon)`
    margin: 5px;
    display: inline;
    fill: ${(props) => props.isEnabled ? MaterialColors.green : MaterialColors.white};
`;

@inject("lightsStore", "sensorStore")
@observer
class SystemSection extends React.Component<ISystemSectionProps, {}> {

    public render() {
        return (
            <div className={this.props.className}>
                <Separator />
                <StyledIcon size={20} name="lightbulb" color={MaterialColors.white} isEnabled={this.props.lightsStore.isOn}/>
                <StyledIcon size={25} name="tilde" color={MaterialColors.white} isEnabled={this.props.sensorStore.isHeating} />
                <StyledIcon size={20} name="tint" color={MaterialColors.white} isEnabled={this.props.sensorStore.isEvaporating} />
                <StyledIcon size={22} name="volume" color={MaterialColors.white} isEnabled={false} />
            </div>
        );
    }
}

export const StyledSystemSection = styled(SystemSection)`
    width: 80%;
    margin: 0px auto 10px auto;
`;
