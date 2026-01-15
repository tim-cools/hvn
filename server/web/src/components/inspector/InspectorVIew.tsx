import React from "react";
import {Box, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useInspectorContext} from "../../state/inspectorContext";
import Paper from '@mui/material/Paper';
import {isLoading} from "../../state/loading";
import ListItemIcon from "@mui/material/ListItemIcon";

const MainTableCell = styled(TableCell)`
  font-size: 1.4em;
  background-color: #eee;
`;

const SubTableCell = styled(TableCell)`
  font-size: 1em;
  background-color: #f7f7f7;
`;

export default function InspectorVIew() {

  const {currentLiveObject} = useInspectorContext();

  if (currentLiveObject == null) {
    return <Box>No live object selected.</Box>;
  }

  if (isLoading(currentLiveObject)) {
    return <Box>Loading.</Box>;
  }

  const path = currentLiveObject.path.toString();

  return (
    <Box component="form" border={0}>
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <TableHead>
              <TableRow >
                <MainTableCell >{path}</MainTableCell>
                <MainTableCell></MainTableCell>
                <MainTableCell align="right">{currentLiveObject.type}</MainTableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <SubTableCell>Property</SubTableCell>
                <SubTableCell>Type</SubTableCell>
                <SubTableCell align="right">Value</SubTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentLiveObject?.properties ? currentLiveObject.properties.map((row) => (
                <TableRow key={row.property}>
                  <TableCell component="th" scope="row">
                    {row.property}
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              )): <></>}
            </TableBody>
            <TableHead>
              <TableRow>
                <SubTableCell>Function</SubTableCell>
                <SubTableCell></SubTableCell>
                <SubTableCell></SubTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentLiveObject?.functions ? currentLiveObject.functions.map((row) => (
                <TableRow key={row}>
                  <TableCell component="th" scope="row">
                    {row}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )): <></>}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}
