import * as React from "react";
import {Button, IHoldButtonProperties} from "./HelperComponents";

export default class HoldButton extends React.Component<IHoldButtonProperties, {}> {

  private timeout: any;
  private start: number;
  private speedup: number;
  private minDelay: number;

  constructor(props: IHoldButtonProperties) {
    super(props);

    this.start = 400;
    this.speedup = 2;
    this.minDelay = 80;
  }

  private onHold() {
    this.props.action();
    this.timeout = setTimeout(this.onHold, this.start);
    this.start = Math.max(this.start / this.speedup, this.minDelay);
  }

  public render() {
      return <Button
        onMouseDown={() => this.onHold()}
        onMouseUp={() => clearTimeout(this.timeout)}
      >
          {this.props.children}
      </Button>
  }
}
