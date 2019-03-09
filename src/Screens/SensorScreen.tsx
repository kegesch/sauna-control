import { inject, observer } from "mobx-react";
import * as React from "react";
import SensorStore from "../Components/Stores/SensorStore";
import SaunaMode from "../Components/SaunaMode";
import finlandImage from "../../assets/icons/images/finland.png";
import aromaImage from "../../assets/icons/images/aroma.png";
import softImage from "../../assets/icons/images/soft.png";
import tropicalImage from "../../assets/icons/images/tropical.png";
import styled from "styled-components";

interface ISensorScreenProperties {
  className?: string;
  sensorStore: SensorStore;
}

const ScreenDiv = styled.div`
  flex: 1; 
  flex-direction: row;
  width: 470px;
  margin: 0 auto;
`;

@inject("sensorStore")
@observer
export default class SensorScreen extends React.Component<
  ISensorScreenProperties,
  {}
> {

  public render() {
        
    return (
      <ScreenDiv className={this.props.className}>
        <SaunaMode name={"finland sauna"} minDegree={70} maxDegree={100} minHumidity={3} maxHumidity={3} imageIconSrc={finlandImage}/>
        <SaunaMode name={"tropical bath"} minDegree={45} maxDegree={60} minHumidity={10} maxHumidity={20} imageIconSrc={tropicalImage}/>
        <SaunaMode name={"soft dampf"} minDegree={45} maxDegree={60} minHumidity={40} maxHumidity={55} imageIconSrc={softImage}/>
        <SaunaMode name={"aroma bath"} minDegree={40} maxDegree={45} minHumidity={40} maxHumidity={55} imageIconSrc={aromaImage}/>
      </ScreenDiv>
    );
  }
}
