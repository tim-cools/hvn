import React, {useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {useLiveApiContext} from "../../state/liveApiContext";

export default function InspectorVIew() {

  const {lastMessage, setOutgoing} = useLiveApiContext();



  return (
    <Box component="form" padding={2}>

    </Box>
  );
}
