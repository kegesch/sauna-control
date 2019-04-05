import { inject, observer } from "mobx-react";
import * as React from "react";
import {BigInfo, MaterialColors, SectionHeader} from "../Components/HelperComponents";
import MusicStore from "../Components/Stores/MusicStore";
import Music from "../Model/Music";
import styled from "styled-components";

interface IMusicScreenProperties {
  className?: string;
  musicStore: MusicStore;
}

const MusicItem = styled.div`
  font-size: 140%;
  color: ${props => props.active ? MaterialColors.green : MaterialColors.white}
  padding: 10px 0px;
`;

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
        <MusicItem active={this.props.musicStore.currentMusic === musicFiles[i]} key={i} onClick={() => this.props.musicStore.playMusic(musicFiles[i])}>{musicFiles[i].name}</MusicItem>
      );
      musicRows.push(row);
    }

    return (
      <div className={this.props.className}>
        <SectionHeader label="Volume" unit="%" />
        <BigInfo>{this.props.musicStore.volume}</BigInfo>
        <div style={{display: "flex", flexDirection: "column", flexWrap: "wrap",  margin: "20px 10px", padding: "20px", height: "200px"}}>{musicRows}</div>
      </div>
    );
  }
}
