import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#3c533c", // Your primary color
    },
    secondary: {
      main: "#fff", // Your secondary color
    },
  },
  typography: {
    allVariants: {
      color: "#333",
      fontFamily: `"Noto Sans", sans-serif`,
      fontSize: "1.3rem",
      fontWeight: "300",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #ddd",
          backgroundColor: "var(--color-green-primary)",
        },
      },
    },
    // MuiTab: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: "none",
    //       fontWeight: "bold",
    //       // fontSize: 16
    //       "&.Mui-selected": {
    //         // color: "red",
    //       },
    //     },
    //     // selected: {
    //     //   color: "red",
    //     // },
    //   },
    // },
  },
});
