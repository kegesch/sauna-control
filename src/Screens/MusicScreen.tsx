import { inject, observer } from "mobx-react";
import * as React from "react";
import { BigInfo, SectionHeader } from "../Components/HelperComponents";
import { upDown$ } from "../Components/Navigation";
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
  private subscription;

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
    const halfIndex = Math.round(musicFiles.length / 2);
    const music1 = musicFiles.slice(0, halfIndex - 1);
    const music2 = musicFiles.slice(halfIndex);

    const musicRows = [];

    for (let i = 0; i < music1.length; i++) {
      const row = (
        <tr>
          <td className="musicColumnLeft">{music1[i].getName()}</td>
          <td className="musicColumnRight">{music2[i].getName()}</td>
        </tr>
      );
      musicRows.push(row);
    }

    return (
      <div className={this.props.className}>
        <SectionHeader label="Volume" unit="%" />
        <BigInfo>{this.props.musicStore.volume}</BigInfo>
        <table>
          <tbody>{musicRows}</tbody>
        </table>
      </div>
    );
  }
}
