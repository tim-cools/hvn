import React, {useState} from 'react';
import {Debugger} from "./components/Debugger";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import MainAppBar from "./components/MainAppBar";
import {Pages} from "./api/navigation";

function App() {

  const [page, setPage] = useState<Pages>(Pages.Debugger);
  const pageView = renderPage(page);

  const theme = createTheme({

  });

  function renderPage(page: Pages) {
    switch (page) {
      case Pages.Debugger:
        return <Debugger />;
    }
    return <>Invalid page</>;
  }

  return <>
    <Debugger />

  </>;
}

export default App;
