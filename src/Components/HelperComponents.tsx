import * as React from "react";
import styled from "styled-components";

interface IColorPalette {
  black: string;
  white: string;
  warmwhite: string;
  green: string;
  red: string;
  blue: string;
  orange: string;
  purple: string;
  ledBlue: string;
  ledRed: string;
}

export const MaterialColors: IColorPalette = {
  black: "#1D1D1D",
  blue: "#03A9F4",
  green: "#8BC34A",
  orange: "#FF9800",
  red: "#F44336",
  white: "#EFF4FF",
  purple: "#D900FF",
  ledBlue: "#005AE0",
  ledRed: "#FF0000",
  warmwhite: "#FFBF0B",
};

export const Separator = styled.div`
  height: 3px;
  background: ${MaterialColors.white};
  width: 100%;
  margin: 10px 0px;
`;

export const SeparatorSelected = styled(Separator)`
  height: 8px;
  margin: 0px 5px 10px 0px;
  border-radius: 2px;
`;

interface IBigInfoProperties extends React.HTMLProps<HTMLParagraphElement> {
  selected?: boolean;
}

const BigInfoUnstyled = (props: IBigInfoProperties) => {
  return <p {...props} />;
};

export const BigInfo = styled(BigInfoUnstyled)`
  display: block;
  font-size: ${props => (props.selected ? "12em" : "10em")};
  font-weight: bolder;
  text-align: center;
  margin: 0px 0px 20px 0px;
  line-height: 90%;

  transition: font-size 0.5s;
`;

interface ISectionHeaderProperties {
  className?: string;
  label: string;
  unit: string;
  value?: string;
}

export const SectionHeaderUnStyled = (props: ISectionHeaderProperties) => {
  let currentValue = "";
  if (props.value) {
    currentValue = props.value;
  }

  return (
    <div className={props.className}>
      <Separator />
      <p className="SectionHeaderLabel">{props.label}</p>
      <p className="SectionHeaderUnit">{currentValue + " " + props.unit}</p>
    </div>
  );
};

export const SectionHeader = styled(SectionHeaderUnStyled)`
  p {
    margin: 0px;
  }

  p.SectionHeaderLabel {
    float: left;
    text-transform: uppercase;
  }

  p.SectionHeaderUnit {
    float: right;
  }

  :after {
    content: ".";
    clear: both;
    display: block;
    visibility: hidden;
    height: 0px;
  }

  width: 80%;
  margin: 0px auto 10px auto;
`;

interface IDivButtonProperties extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: any;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const DivButton = (props: IDivButtonProperties) => {
  return (
    <div className={props.className} onClick={props.onClick} {...props}>
      {props.children}
    </div>
  );
};

export const Button = styled(DivButton)`
  display: inline;
  cursor: pointer;
`;

export interface IHoldButtonProperties {
  action: () => void;
  children?: any;
  className?: string;
}

const SelectedDiv = styled("div")`
  border: 2px solid ${MaterialColors.white};
  border-radius: 5px;
`;

export interface ISelectableDivProperties {
  selected: boolean;
  children?: any;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const SelectableDiv = (props: ISelectableDivProperties) => {
  if (!props.selected) {
    return <div onClick={props.onClick}>{props.children}</div>;
  } else {
    return <SelectedDiv onClick={props.onClick}>{props.children}</SelectedDiv>;
  }
};

interface IColorBoxProperties extends IDivButtonProperties {
  icolor: string;
  size: number;
  selected?: boolean;
}

const UnstyledColorBox = (props: IColorBoxProperties) => {
  return (
    <div className={props.className} onClick={props.onClick} {...props}>
      {props.children}
    </div>
  );
};
export const ColorBox = styled(UnstyledColorBox)`
  background-color: ${props => props.icolor};
  border-radius: 8px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  ${props => props.selected ? "border: 2px solid " + MaterialColors.green + "; margin: 8px;" : "margin: 10px;"}
`;
