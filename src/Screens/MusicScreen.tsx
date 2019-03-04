import { inject, observer } from "mobx-react";
import * as React from "react";
import { BigInfo, SectionHeader } from "../Components/HelperComponents";
import MusicStore from "../Components/Stores/MusicStore";
import Music from "../Model/Music";

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
