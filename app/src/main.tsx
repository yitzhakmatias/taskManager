import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import App from "./App";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366F1" },
    error:   { main: "#EF4444" },
    background: {
      default: "#0F1117",
      paper:   "#1A1D27",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 700 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: "#22263A" },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
