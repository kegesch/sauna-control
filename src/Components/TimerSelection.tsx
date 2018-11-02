import * as React from "react";
import Timer from "../Model/Timer";
import {Button, MaterialColors} from "./HelperComponents";
import {LayerIcon, TimerNumberIcon} from "./Icon";

interface ITimerSelectionProps {
    className?: string;
    values: number[];
    color: string;
    size: number;
}

interface ITimerSelectionState {
    selectedTimerIndex: number;
}

export default class TimerSelection extends React.Component<ITimerSelectionProps, ITimerSelectionState> {

    private timer: Timer;

    constructor(props: ITimerSelectionProps) {
        super(props);

        this.state = {selectedTimerIndex: -1};
    }

    public render() {
        const timerSymbols = this.props.values.map((value: number, index: number) => {
            let color = MaterialColors.white;
            if (index === this.state.selectedTimerIndex) { color = this.props.color; }
            return <Button key={index} onClick={() => { this.toggleTimer(index); }}>
                <TimerNumberIcon colorValue={color} size={this.props.size} value={value}/>
            </Button>;
        });

        return (
            <div className={this.props.className}>
                <LayerIcon names={["circle", "timer"]} colors={[this.props.color, MaterialColors.white]} size={this.props.size}/>
                {timerSymbols}
            </div>
        );
    }

    private toggleTimer(index: number) {
        if (this.state.selectedTimerIndex === -1) {
            this.setState({selectedTimerIndex: index});
            this.timer = new Timer(this.props.values[index] * 60, () => {
                this.onTimerEnd();
            });
            this.timer.setTimer();
        }
        if (this.state.selectedTimerIndex === index) {
            this.setState({selectedTimerIndex: -1});
            this.timer.stopTimer();
        }
    }

    private onTimerEnd() {
        console.log("timer of " + this.props.values[this.state.selectedTimerIndex] + "min has ended.");
        this.setState({selectedTimerIndex: -1});
        // TODO
    }

}
