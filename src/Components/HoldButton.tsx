import * as React from "react";
import {Button, IHoldButtonProperties} from "./HelperComponents";

export default class HoldButton extends React.Component<IHoldButtonProperties, {}> {

  private timeout: any;
  private start: number;
  private speedup: number;
  private minDelay: number;

  constructor(props: IHoldButtonProperties) {
    super(props);

    this.reset();
  }

  private onHold() {
    console.log("hold")
    this.props.action();
    this.timeout = setTimeout(() => this.onHold(), this.start);
    this.start = Math.max(this.start / this.speedup, this.minDelay);
  }

  private reset() {
    this.start = 400;
    this.speedup = 2;
    this.minDelay = 80;
    clearTimeout(this.timeout)
  }

  public render() {
      return <Button
        onMouseDown={() => {
          console.log("down");
          this.onHold()
        }}
        onMouseUp={() => {
          console.log("up");
          this.reset();
        }}
      >
          {this.props.children}
      </Button>
  }
}
