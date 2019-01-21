import { inject, observer } from "mobx-react";
import * as React from "react";
import { BigInfo, SectionHeader } from "../Components/HelperComponents";
import { upDown$ } from "../Components/Navigation";
import MusicStore from "../Components/Stores/MusicStore";
import Music from "../Model/Music";
import {Subscription} from "rxjs";

interface IMusicScreenProperties {
  className?: string;
  musicStore: MusicStore;
}

@inject("musicStore")
@observer
export default class MusicScreen extends React.Component<
  IMusicScreenProperties,
  {}
> {
  private subscription: Subscription;

  public componentWillMount(): void {
    this.subscription = upDown$.subscribe({
      error: err => {
        console.log("Error on retrieving next: " + err);
      },
      next: value => {
        if (value === "up") {
          this.props.musicStore.setVolume(this.props.musicStore.volume + 1);
        } else if (value === "down") {
          this.props.musicStore.setVolume(this.props.musicStore.volume - 1);
        }
      }
    });
  }

  public componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  public render() {
    const musicFiles: Music[] = this.props.musicStore.musicFiles || [];
    const musicRows = [];

    for (let i = 0; i < musicFiles.length; i++) {
      const row = (
        <div key={i} onClick={() => this.props.musicStore.playMusic(musicFiles[i])}>{musicFiles[i].artist +" - "+musicFiles[i].title}</div>
      );
      musicRows.push(row);
    }

    return (
      <div className={this.props.className}>
        <SectionHeader label="Volume" unit="%" />
        <BigInfo>{this.props.musicStore.volume}</BigInfo>
        <div style={{display: "flex", flex: "row", margin: "20px 10px", padding: "10px"}}>{musicRows}</div>
      </div>
    );
  }
}
