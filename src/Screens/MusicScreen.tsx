import { inject, observer } from "mobx-react";
import * as React from "react";
import { MaterialColors, SectionHeader } from "../Components/HelperComponents";
import MusicStore from "../Components/Stores/MusicStore";
import Music from "../Model/Music";
import styled from "styled-components";
import forestImage from "../../assets/icons/images/forrest.png";

interface IMusicScreenProperties {
  className?: string;
  musicStore: MusicStore;
}

const MusicName = styled.div`
  font-size: 140%;
  line-height: 38px;
  color: ${props => props.active ? MaterialColors.green : MaterialColors.white}
`;

const Duration = styled.div`
  margin-left: auto;
  line-height: 38px;
`;

const ForrestImage = styled.img`
  height: 38px;
  margin-right: 20px;
  border-radius: 8px;
`;

interface IMusicItemProps extends  React.HTMLProps<HTMLDivElement> {
  active: boolean;
  name: string;
  duration: number;
}

const MusicItem = (props: IMusicItemProps) => {
  return <div {...props} style={{margin: "4px 20px", display: "flex", alignItems: "flex-start"}}>
    <ForrestImage src={forestImage} />
    <MusicName active={props.active}>{props.name}</MusicName>
    <Duration>{props.duration} min</Duration>
  </div>
};

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
        <MusicItem active={this.props.musicStore.currentMusic === musicFiles[i]} key={i} onClick={() => this.props.musicStore.playMusic(musicFiles[i])} name={musicFiles[i].name} duration={musicFiles[i].duration}/>
      );
      musicRows.push(row);
    }

    return (
      <div className={this.props.className}>
        <SectionHeader label="Musik" unit={""+musicRows.length} />
        <div style={{display: "flex", flexWrap: "nowrap", flexDirection: "column", margin: "10px 10px", padding: "20px", height: "500px"}}>{musicRows}</div>
      </div>
    );
  }
}
