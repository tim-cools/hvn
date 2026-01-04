import React, {useState} from 'react';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import MainAppBar from "./components/MainAppBar";
import {Pages} from "./state/navigation";
import {Contexts} from "./state/Contexts";
import {MainPage} from "./components/MainPage";

function App() {

  const [page, setPage] = useState<Pages>(Pages.Inspector);

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return <div style={{ height: '100vh', background: '#EEE' }}>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Contexts>
        <MainAppBar setPage={setPage} />
        <MainPage page={page} />
      </Contexts>
    </ThemeProvider>
  </div>;
}

export default App;
