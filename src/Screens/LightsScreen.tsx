import {inject, observer} from "mobx-react";
import * as React from "react";
import styled from "styled-Components";
import {BigInfo, MaterialColors, SectionHeader} from "../Components/HelperComponents";
import {BoxedIcon} from "../Components/Icon";
import {upDown$} from "../Components/Navigation";
import LightsStore from "../Components/Stores/LightsStore";

interface ILightsScreenProperties {
    className?: string;
    lightsStore: LightsStore;
}

const IconLink = styled(BoxedIcon)`
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    fill: ${(props) => props.isEnabled ? MaterialColors.green : MaterialColors.white};
`;

@inject("lightsStore")
@observer
export default class LightsScreen extends React.Component<ILightsScreenProperties, {}> {

    private subscription;

    public componentWillMount(): void {

        this.subscription = upDown$.subscribe({
            error: (err) => {console.log("Error on retrieving next: " + err); },
            next: (value) => {
                if (value === "up") {
                    this.props.lightsStore.setBrightness(this.props.lightsStore.brightness + 1);
                } else if (value === "down") {
                    this.props.lightsStore.setBrightness(this.props.lightsStore.brightness - 1);
                }
            },
        });

    }

    public componentWillUnmount(): void {

        this.subscription.unsubscribe();
    }

    public render() {
        return (
            <div className={this.props.className}>
                <SectionHeader label="HELLIGKEIT" unit="%"/>
                <BigInfo>{this.props.lightsStore.brightness}</BigInfo>
                <IconLink name="power" size={150} color={MaterialColors.white} onClick={() => {
                    this.props.lightsStore.togglePower();
                    }} isEnabled={this.props.lightsStore.isOn}/>
                <IconLink name="auto" size={150} color={MaterialColors.white} onClick={() => {
                    this.props.lightsStore.toggleAuto();
                }} isEnabled={this.props.lightsStore.isAuto}/>
            </div>
        );
    }
}
