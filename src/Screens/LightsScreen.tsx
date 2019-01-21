import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import {
  BigInfo, ColorBox,
  MaterialColors,
  SectionHeader
} from "../Components/HelperComponents";
import { BoxedIcon } from "../Components/Icon";
import { upDown$ } from "../Components/Navigation";
import LightsStore from "../Components/Stores/LightsStore";

interface ILightsScreenProperties {
  className?: string;
  lightsStore: LightsStore;
}

const IconLink = styled(BoxedIcon)`
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
  fill: ${props =>
    props.isEnabled ? MaterialColors.green : MaterialColors.white};
`;

@inject("lightsStore")
@observer
export default class LightsScreen extends React.Component<
  ILightsScreenProperties,
  {}
> {
  private subscription: any;

  public componentWillMount(): void {
    this.subscription = upDown$.subscribe({
      error: err => {
        console.log("Error on retrieving next: " + err);
      },
      next: value => {
        if (value === "up") {
          this.props.lightsStore.setBrightness(
            this.props.lightsStore.brightness + 1
          );
        } else if (value === "down") {
          this.props.lightsStore.setBrightness(
            this.props.lightsStore.brightness - 1
          );
        }
      }
    });
  }

  public componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  public render() {
    return (
      <div className={this.props.className}>
        <SectionHeader label="HELLIGKEIT" unit="%" />
        <BigInfo>{this.props.lightsStore.brightness}</BigInfo>
        <div style={{display: 'flex', flex: 'row', justifyContent: 'center'}}>
          {
            this.props.lightsStore.colors.map((color, index) =>
              <ColorBox
                key={index}
                size={50}
                icolor={color}
                selected={this.props.lightsStore.selectedColorIndex == index}
                onClick={() => {this.props.lightsStore.selectColor(index)}} />)
          }
        </div>
        <div style={{display: 'flex', flex: 'row', justifyContent: 'center', marginTop: 20}}>
          <IconLink
            name="power"
            size={130}
            color={MaterialColors.white}
            onClick={() => {
              this.props.lightsStore.togglePower();
            }}
            isEnabled={this.props.lightsStore.isOn}
          />
          <IconLink
            name="auto"
            size={130}
            color={MaterialColors.white}
            onClick={() => {
              this.props.lightsStore.toggleAuto();
            }}
            isEnabled={this.props.lightsStore.isAuto}
          />
        </div>
      </div>
    );
  }
}
