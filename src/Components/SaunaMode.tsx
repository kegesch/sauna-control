import * as React from "react";
import styled from "styled-components";
import Icon from "./Icon";
import {MaterialColors} from "./HelperComponents";

interface ISaunaModeProps {
  name: string;
  minDegree: number;
  maxDegree: number;
  minHumidity: number;
  maxHumidity: number
  imageIconSrc: any;
  onClick?: () => void;
}

const Container = styled.div`
  display: flex;
  flex: 1; 
  flex-direction: row;
  font-size: 190%;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding: 10px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex: 1; 
  flex-direction: column;
  padding-left: 10px;
`;

const InfoParagraph = styled.p`
  padding: 0px;
  margin: 0px;
`;

const RoundedImg = styled.img`
  border-radius: 8px;
`;

const SettingsBox = styled.div`
  justify-self: end;
`;

export default class SaunaMode extends React.Component<ISaunaModeProps, {}> {

  private buildInfoString(min: number, max: number) {
      return (min == max ? min: min+" - "+max);
  }

  public render() {
    return (
      <Container>
        <RoundedImg height={115} src={this.props.imageIconSrc} onClick={() => {
          this.props.onClick()
        }}/>
        <InfoContainer>
          <InfoParagraph>{this.props.name}</InfoParagraph>
          <SettingsBox>
            <InfoParagraph><Icon size={20} name={"tint"} color={MaterialColors.white}/>{this.buildInfoString(this.props.minHumidity, this.props.maxHumidity)}%</InfoParagraph>
            <InfoParagraph><Icon size={20} name={"thermometer"} color={MaterialColors.white}/>{this.buildInfoString(this.props.minDegree, this.props.maxDegree)}°C</InfoParagraph>
          </SettingsBox>
        </InfoContainer>
      </Container>
    )
  }

}
