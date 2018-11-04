import {inject, observer} from "mobx-react";
import * as React from "react";
import {Link} from "react-router-dom";
import * as Rx from "rxjs";
import styled from "styled-components";
import {Button, MaterialColors} from "./HelperComponents";
import {BoxedIcon, default as Icon} from "./Icon";
import SystemStore from "./Stores/SystemStore";

interface INavigationProps {
    className?: string;
    iconSize: number;
    systemStore?: SystemStore;
}

const StyledIcon = styled(Icon)`
    margin: 5px auto;
`;

export const upDown$: Rx.Subject<string> = new Rx.Subject<string>();

@inject("systemStore")
@observer
export default class Navigation extends React.Component<INavigationProps, {}> {

    public render() {
        return (
            <table className={this.props.className}>
                <tbody>
                    <tr>
                        <td/>
                        <td colSpan={3}>
                            <span style={{color: MaterialColors.orange}}>{this.props.systemStore.errorMessage}</span>
                        </td>
                        <td>
                            <Button onClick={() => {
                                upDown$.next("up");
                            }}>
                                <BoxedIcon isEnabled size={this.props.iconSize} name={"up"} color={MaterialColors.white}/>
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td><Button onClick={() => this.toggleSystemState()}><StyledIcon size={this.props.iconSize} name="power" color={this.props.systemStore.isOn ? MaterialColors.green : MaterialColors.red}/></Button></td>
                        <td><Link to="/sensors"><StyledIcon size={this.props.iconSize} name="thermometer" color={MaterialColors.white} /></Link></td>
                        <td><Link to="/lights"><StyledIcon size={this.props.iconSize} name="lightbulb" color={MaterialColors.white}/></Link></td>
                        <td><Link to="/timers"><StyledIcon size={this.props.iconSize} name="timer" color={MaterialColors.white}/></Link></td>
                        <td><Link to="/music"><StyledIcon size={this.props.iconSize} name="volumebold" color={MaterialColors.white}/></Link></td>
                    </tr>
                    <tr>
                        <td/>
                        <td colSpan={3} >
                            <span style={{fontSize: "140%", color: MaterialColors.red}}>Hotwãve</span>
                        </td>
                        <td>
                            <Button onClick={() => {
                                upDown$.next("down");
                            }}>
                                <BoxedIcon isEnabled size={this.props.iconSize} name={"down"} color={MaterialColors.white}/>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>

        );
    }

    private toggleSystemState() {
        this.props.systemStore.toggleState();
    }
}
