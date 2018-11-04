import * as React from "react";
import styled from "styled-components";
import {MaterialColors, SectionHeader} from "../Components/HelperComponents";
import TimerSelection from "../Components/TimerSelection";

interface ITimerScreenProps {
    className?: string;
}

const StyledTimerSelection = styled(TimerSelection)`
    margin: 20px 0px;
`;

export default class TimerScreen extends React.Component<ITimerScreenProps, {}> {

    public render() {
        return <div className={this.props.className}>
            <SectionHeader label="Timer" unit="min"/>
            <div style={{width: "90%", margin: "0 auto"}}>
                <StyledTimerSelection values={[5, 8, 10, 12]} color={MaterialColors.red} size={117}/>
                <StyledTimerSelection values={[5, 8, 10, 12]} color={MaterialColors.green} size={117}/>
                <StyledTimerSelection values={[5, 8, 10, 12]} color={MaterialColors.blue} size={117}/>
            </div>
        </div>;
    }

}
