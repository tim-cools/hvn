import React, {useState} from "react";
import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {useLiveApiContext} from "../../state/liveApiContext";
import {ObjectPath} from "../../api/objectPath";

export default function DebuggerView() {

  const [path, setPath] = useState<string>("live_set master_track mixer_device volume");
  const [name, setName] = useState<string>("value");
  const {lastMessage, setOutgoing} = useLiveApiContext();
  const message = lastMessage;

  function sendMessage(action: string) {
    const data = {
      action: action,
      path: path,
      name: name,
    };
    setOutgoing(messages => messages.queue(data));
  }

  function getChildren() {
    setOutgoing(messages => messages.getChildren(ObjectPath.parseString(path)));
  }

  function renderGetMessage() {
    return <TextField id="outlined-basic" label="Get" variant="outlined" value={message.value} />
  }

  function renderCollection(name: string, values: any[]) {
    const elements = values ? values.map(value => <div>{JSON.stringify(value)}</div>) : <div>empty</div>;
    return <Paper>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        {name}
      </Typography>
      {elements}
    </Paper>;
  }

  function renderInfoMessage() {
    if (message.error) {
      return <Paper elevation={3}>{message.value}</Paper>;
    }
    return <Stack direction="column" spacing={2}>
      <TextField label="Id" variant="outlined" value={message.value.id} />
      <TextField label="type" variant="outlined" value={message.value.type} />
      <TextField label="description" variant="outlined" value={message.value.description} />
      <>{renderCollection("children", message.value.children)}</>
      <>{renderCollection("properties", message.value.properties)}</>
      <>{renderCollection("functions", message.value.functions)}</>
    </Stack>;
  }

  function renderMessageView() {
    if (message == null) return <></>;
    if (message.action == "get") {
      return renderGetMessage();
    } else if (message.action == "info") {
      return renderInfoMessage();
    }
    return <Box>
      {JSON.stringify(message)}
    </Box>
  }

  const messageView = renderMessageView();

  return (
    <Box component="form" padding={2}>
      <Stack spacing={2} direction="row">
        <TextField id="outlined-basic" label="Path" variant="outlined" value={path}
                   style={{width: 600}}
                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                     setPath(event.target.value);
                   }} />
        <TextField id="outlined-basic" label="Property/Function" variant="outlined" value={name}
                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                     setName(event.target.value);
                   }} />
        <Button variant="contained" onClick={() => sendMessage("get")}>Get</Button>
        <Button variant="contained" onClick={() => sendMessage("call")}>Call</Button>
        <Button variant="contained" onClick={() => getChildren()}>Get children</Button>
        <Button variant="contained" onClick={() => sendMessage("info")}>Info</Button>
      </Stack>
      {messageView}
    </Box>
  );
}