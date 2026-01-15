import React from "react";
import {Box, Grid, Paper, styled} from "@mui/material";
import Explorer from "./inspector/Explorer";
import Button from "@mui/material/Button";
import {LayoutState, LeftContainer, MainContainer} from "../state/layoutState";
import {useInspectorContext} from "../state/inspectorContext";
import InspectorVIew from "./inspector/InspectorVIew";
import DebuggerView from "./inspector/DebuggerView";

const GridFullHeight = styled(Grid)`
  height: calc(100% - 264px);
`;

const GridItem = styled(Grid)`
  height: 100%;
  padding: 8px;
`;

const ToolPanel = styled(Grid)`
  height: 200px;
  padding: 0 8px 8px;
`;

const FullHeightPaper = styled(Paper)`
  height: 100%;
  padding: 2px;
  overflow-y: auto;
`;

const TopPart = styled(Box)`
  height: calc(100% - 44px);
  padding: 0;
  overflow-y: auto;
`;

const BottomPart = styled(Box)`
  height: 44px;
  padding: 8px 0 0;
`;

export function InspectorPage() {

  const {layout, setLayout} = useInspectorContext();

  const leftOptions = [
    { name: 'Explorer', value: LeftContainer.Explorer, element: () => <Explorer /> },
  ];

  const mainOptions = [
    { name: 'Inspector', value: MainContainer.View, element: () => <InspectorVIew /> },
    { name: 'Debugger', value: MainContainer.Debugger, element: () => <DebuggerView /> }
  ];

  function OptionButtonsGroup<T>(values: {name: string, value: T}[], currentValue: T, setValue: (item: T) => void) {
    return <BottomPart>
      {values.map(value => <Button
        key={value.name}
        variant={(value.value === currentValue ? 'contained' : 'text')}
        onClick={() => setValue(value.value)}>
        {value.name}
      </Button>)}
    </BottomPart>;
  }

  function setValue<T>(setLayoutValue: (layout: LayoutState, item: T) => LayoutState) {
    return (value: T) => setLayout(layout => setLayoutValue(layout, value));
  }

  function content<T>(values: {value: T, element: () => React.ReactNode}[], currentValue: T) {
    return <TopPart>
      {values.find(value => value.value === currentValue)?.element()}
    </TopPart>;
  }

  return (
    <GridFullHeight container style={{height: 'calc(100% - 64px)'}}>
      <GridItem size={4}>
        <FullHeightPaper>
          {content(leftOptions, layout.leftContainer)}
          {OptionButtonsGroup(leftOptions, layout.leftContainer, setValue<LeftContainer>((layout, value) => layout.setLeftContainer(value)))}
        </FullHeightPaper>
      </GridItem>
      <GridItem size={8}>
        <FullHeightPaper>
          {content(mainOptions, layout.mainContainer)}
          {OptionButtonsGroup(mainOptions, layout.mainContainer, setValue<MainContainer>((layout, value) => layout.setMainContainer(value)))}
        </FullHeightPaper>
      </GridItem>
    </GridFullHeight>
  );
}
