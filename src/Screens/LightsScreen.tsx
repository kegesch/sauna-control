import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import {
  BigInfo, Button, ColorBox, DivButton,
  MaterialColors, RoundButton,
  SectionHeader
} from "../Components/HelperComponents";
import {BoxedIcon, default as Icon} from "../Components/Icon";
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

const StyledIcon = styled(Icon)`
  margin: 5px auto;
`;

@inject("lightsStore")
@observer
export default class LightsScreen extends React.Component<
  ILightsScreenProperties,
  {}
> {

  public render() {
    return (
      <div className={this.props.className}>
        <SectionHeader label="HELLIGKEIT" unit="%" />
        <div style={{display: 'flex', flex: 'row', justifyContent: 'center'}}>
          <Button onClick={() => this.props.lightsStore.setBrightness(this.props.lightsStore.brightness-10)}>
            <StyledIcon
              size={90}
              name="down"
              color={MaterialColors.white}
            />
          </Button>
          <BigInfo>{this.props.lightsStore.brightness}</BigInfo>
          <Button style={{marginLeft: 20,}}  onClick={() => this.props.lightsStore.setBrightness(this.props.lightsStore.brightness+10)}>
            <StyledIcon
              size={90}
              name="up"
              color={MaterialColors.white}
            />
          </Button>
        </div>
        <div style={{display: 'flex', flex: 'row', justifyContent: 'center', marginTop: 20}}>
          <RoundButton text={"Auto"} height={50} onClick={() => {
            this.props.lightsStore.enableAuto();
          }} selected={this.props.lightsStore.isAuto}/>
          <RoundButton text={"Off"} height={50} onClick={() => {
            this.props.lightsStore.off();
              }} selected={!this.props.lightsStore.isOn}/>

        </div>
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

      </div>
    );
  }
}
