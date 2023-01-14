import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { LogProvider } from "context/logContext";
import { StatsProvider } from "context/statsContext";
import { PeakListProvider } from "context/peakListContext";
import { NewEntryProvider } from "context/newEntryContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LogProvider>
      <StatsProvider>
        <PeakListProvider>
          <NewEntryProvider>
            <App />
          </NewEntryProvider>
        </PeakListProvider>
      </StatsProvider>
    </LogProvider>
  </React.StrictMode>
);
