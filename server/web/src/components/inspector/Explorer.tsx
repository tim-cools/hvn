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
import {isLoading, Loading} from "../../state/loading";
import {LiveObject} from "../../api/abletonLive";
import DataObjectIcon from '@mui/icons-material/DataObject';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {useLiveApiContext} from "../../state/liveApiContext";

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
  const {setOutgoing} = useLiveApiContext();
  const {liveObjectsTreeState, setLiveObjectsTreeState, setCurrentLiveObject} = useInspectorContext();

  const open = liveObjectsTreeState.isOpen(liveObject.path);
  const setOpen = (value: boolean) => {
    console.log(">>> setOpen " + liveObject.path.fullPath() + " liveObject.childrenNotLoaded>>>" + liveObject.childrenNotLoaded);
    console.log(">>> setOpen " + liveObject.path.fullPath() + " liveObject.childrenNotLoaded>>>" + liveObject.childrenNotLoaded);
    console.log(">>> setOpen " + liveObject.path.fullPath() + " liveObject.childrenNotLoaded>>>" + liveObject.childrenNotLoaded);
    if (loading) return;
    if (liveObject.childrenNotLoaded) {
      setLiveObjectsTreeState(state => state.setLoading(liveObject.path, true));
      setTimeout(() => {
        setOutgoing(messages => messages.getChildren(liveObject.path))
      }, 500);
    } else {
      setLiveObjectsTreeState(state => state.setOpen(liveObject.path, value));
    }
  }

  const hasChildren = liveObject.childrenNotLoaded || liveObject.children.length > 0;
  const loading = liveObjectsTreeState.isLoading(liveObject.path);
  console.log(liveObject.childrenNotLoaded + ": lo: " + liveObject.path.fullPath() + " >> children.length: " + liveObject.children.length + " >> hasChildren " + hasChildren);
  const innerStyle = indent > 0
      ? hasChildren
        ? ({marginLeft: (indentValue * indent) + 'px'})
        : ({paddingLeft: (emptyIndentValue + indentValue * indent) + 'px'})
      : ({});

  function selectObject() {
    if (!liveObject.infoLoaded) {
      setCurrentLiveObject(new Loading())
      setOutgoing(messages => messages.getInfo(liveObject.path));
    }
    return setCurrentLiveObject(liveObject);
  }

  return (
    <>
      <ListItem disablePadding onClick={() => selectObject()}>
        <NoPaddingListItemButton style={innerStyle}>
          {loading
            ? <NoPaddingListItemIcon onClick={() => setOpen(!open)}>
              <AutorenewIcon fontSize={"small"}  sx={{
                animation: "spin 2s linear infinite",
                "@keyframes spin": {
                  "0%": {transform: "rotate(0deg)"},
                  "100%": {transform: "rotate(360deg)"},
                },
              }}  />
            </NoPaddingListItemIcon>
            : <></>}
          {!loading && hasChildren ? <NoPaddingListItemIcon onClick={() => setOpen(!open)}>
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