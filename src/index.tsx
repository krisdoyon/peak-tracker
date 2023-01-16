import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { LogProvider } from "context/logContext";
import { StatsProvider } from "context/statsContext";
import { PeakListProvider } from "context/peakListContext";
import { NewEntryProvider } from "context/newEntryContext";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <NewEntryProvider>
        <LogProvider>
          <StatsProvider>
            <PeakListProvider>
              <App />
            </PeakListProvider>
          </StatsProvider>
        </LogProvider>
      </NewEntryProvider>
    </Router>
  </React.StrictMode>
);
