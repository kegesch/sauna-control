import * as React from "react";
import styled from "styled-components";
import {MaterialColors, SectionHeader} from "../Components/HelperComponents";
import TimerSelection from "../Components/TimerSelection";
import ILightsService from "../Services/Interfaces/ILightsService";
import {string} from "prop-types";

interface ITimerScreenProps {
    className?: string;
    lightService: ILightsService;
}

const StyledTimerSelection = styled(TimerSelection)`
    margin: 20px 0px;
`;

export default class TimerScreen extends React.Component<ITimerScreenProps, {}> {
    private colorToHexArray(color: string): [number, number, number] {
        const number = parseInt(color.substr(1), 16);
        return [number >> 16 & 0xFF, number >> 8 & 0xFF, number & 0xFF];
    }

    public render() {
        const red = this.colorToHexArray(MaterialColors.red);
        const green = this.colorToHexArray(MaterialColors.green);
        const blue = this.colorToHexArray(MaterialColors.blue);
        return <div className={this.props.className}>
            <SectionHeader label="Timer" unit="min"/>
            <div style={{width: "90%", margin: "0 auto"}}>
                <StyledTimerSelection
                  values={[1, 8, 10, 12]}
                  color={MaterialColors.red}
                  size={117}
                  onEnd={() => this.props.lightService.blinkTimer(red, 2, 800)}/>
                <StyledTimerSelection
                  values={[2, 8, 10, 12]}
                  color={MaterialColors.green}
                  size={117}
                  onEnd={() => this.props.lightService.blinkTimer(green, 2, 800)}/>
                <StyledTimerSelection
                  values={[5, 8, 10, 12]}
                  color={MaterialColors.blue}
                  size={117}
                  onEnd={() => this.props.lightService.blinkTimer(blue, 2, 800)}/>
            </div>
        </div>;
    }

}
