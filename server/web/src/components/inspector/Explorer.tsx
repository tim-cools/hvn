import React from 'react';
import {useInspectorContext} from '../../state/inspectorContext';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {CircularProgress, styled} from "@mui/material";
import Box from "@mui/material/Box";
import {isLoading} from "../../state/loading";
import {LiveObject} from "../../api/abletonLive";
import DataObjectIcon from '@mui/icons-material/DataObject';

const indentValue = 16;
const emptyIndentValue = 30;

const NoPaddingListItemButton = styled(ListItemButton)`
  padding: 0;
`;

const NoPaddingListItemIcon = styled(ListItemIcon)`
  padding: 0;
  min-width: 30px
`;

function LiveObjectItem(props: {liveObject: LiveObject, indent: number}) {

  const {liveObject, indent} = props;
  const {liveObjectsTreeState, setLiveObjectsTreeState, setCurrentLiveObject} = useInspectorContext();
  const open = liveObjectsTreeState.isOpen(liveObject.path);
  const setOpen = (value: boolean) => setLiveObjectsTreeState(state => state.setOpen(liveObject.path, value));
  const hasChildren = !liveObject.childrenLoaded || liveObject.children.length > 0;
  const innerStyle = indent > 0
      ? hasChildren
        ? ({marginLeft: (indentValue * indent) + 'px'})
        : ({paddingLeft: (emptyIndentValue + indentValue * indent) + 'px'})
      : ({});

  return (
    <>
      <ListItem disablePadding onClick={() => setCurrentLiveObject(liveObject)}>
        <NoPaddingListItemButton style={innerStyle}>
          {hasChildren ? <NoPaddingListItemIcon onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon fontSize={"small"} /> : <KeyboardArrowRightIcon fontSize={"small"} />}
          </NoPaddingListItemIcon>
            : <></>}
          <NoPaddingListItemIcon>
            <DataObjectIcon fontSize={"small"} />
          </NoPaddingListItemIcon>
          <ListItemText primary={liveObject.name}/>
        </NoPaddingListItemButton>
      </ListItem>
      {open && liveObject.children ? liveObject.children.map(child =>
        <LiveObjectItem key={child.name} liveObject={child} indent={indent + 1} />) : []
      }
    </>
  );
}

function Explorer() {

  const {
    liveObjects
  } = useInspectorContext();

  function content() {
    if (liveObjects === null) {
      return <Box>Live objects not loaded.</Box>;
    }
    if (isLoading(liveObjects)) {
      return <CircularProgress/>;
    }
    return  liveObjects.root
      ? liveObjects.root.children.map(child => <LiveObjectItem key={child.name} liveObject={child} indent={1} />)
      : [];
  }

  return (
    <List disablePadding>
      {content()}
    </List>
  );
}

export default Explorer;