import SensorStore from "../Components/Stores/SensorStore";
import styled from "styled-components";
import SaunaMode from "../Model/SaunaMode";
import {BigInfo, Button, MaterialColors, SectionHeader} from "../Components/HelperComponents";
import * as React from "react";
import {default as Icon} from "../Components/Icon";
import {observer} from "mobx-react";

interface ISaunaModeScreenProps {
  sensorStore: SensorStore
  saunaMode: SaunaMode;
}

const Container = styled.div`
  width: 470px;
  margin: 0 auto;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const StyledImage = styled.img`
  width: 110px;
  border-radius: 8px;
  margin: 0 auto; 
  margin-bottom: 20px;
`;

const Title = styled.p`
  padding: 0px;
  margin: 0px 10px;
  font-size: 150%;
  text-transform: uppercase;
  text-align: center;
`;

@observer
export default class SaunaModeScreen extends React.Component<ISaunaModeScreenProps, {}> {

  public constructor(props: ISaunaModeScreenProps) {
    super(props);
  }

  public render() {
    return (
      <Container>
        <Button style={{marginLeft: 40}} onClick={() => this.props.sensorStore.selectSaunaMode(null)}>
          <Icon size={30} name={"left"} color={MaterialColors.white}/>
        </Button>
        <StyledImage src={this.props.saunaMode.iconImage}/>
        <Title>{this.props.saunaMode.name}</Title>
        <SensorSettingEditor
          title={"Temperatur"}
          maxValue={this.props.saunaMode.maxTemperature}
          minValue={this.props.saunaMode.minTemperature}
          defaultValue={this.props.saunaMode.defaultTemperature}
          stepSize={5}
          setValue={(value) => this.props.sensorStore.setTemp(value)}
          unit={"°C"}
          targetValue={this.props.sensorStore.setPointTemp}
          currentValue={this.props.sensorStore.currentTemp}
        />
        <SensorSettingEditor
          title={"Feuchtigkeit"}
          maxValue={this.props.saunaMode.maxHumidity}
          minValue={this.props.saunaMode.minHumidity}
          defaultValue={this.props.saunaMode.defaultHumidity}
          stepSize={5}
          setValue={(value) => this.props.sensorStore.setHumid(value)}
          unit={"%"}
          targetValue={this.props.sensorStore.setPointHumid}
          currentValue={this.props.sensorStore.currentHumid}
        />
      </Container>
    )
  }

}

interface ISensorSettingEditorProps {
  title: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  setValue: (value: number) => void;
  stepSize: number;
  unit: string;
  targetValue: number
  currentValue: number;
}

const StyledIcon = styled(Icon)`
  margin: 5px auto;
`;

const Value = styled.p`
  display: block;
  font-size: 200%;
  text-align: center;
  margin: 10px 0px 0px 10px;
  line-height: 90%;
  `;

const InlineDiv = styled.div`
  display: flex; 
  flex: 1; 
  flex-direction: row;
  justify-content: center;
`;

const SensorSettingEditor = (props: ISensorSettingEditorProps) => {
  const showButtons = (props.minValue != props.maxValue);

  const downButton = <Button onClick={() => props.setValue(props.targetValue - props.stepSize)}>
      <StyledIcon
      size={50}
      name="down"
      color={MaterialColors.white}
      />
    </Button>

  const upButton = <Button style={{marginLeft: 20,}}  onClick={() => props.setValue(props.targetValue + props.stepSize)}>
      <StyledIcon
        size={50}
        name="up"
        color={MaterialColors.white}
      />
    </Button>

  return (
    <div style={{display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'center', marginTop: 20}}>
      <SectionHeader label={props.title} unit={ props.currentValue + props.unit}/>
      <InlineDiv>
        {showButtons ? downButton : null}
        <Value>{props.targetValue}</Value>
        {showButtons ? upButton : null}
      </InlineDiv>
    </div>
  )
}
