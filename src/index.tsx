import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { LogProvider } from "context/logContext";
import { StatsProvider } from "context/statsContext";
import { PeakListProvider } from "context/peakListContext";
import { NewEntryProvider } from "context/newEntryContext";
import { BrowserRouter as Router } from "react-router-dom";
import { MapProvider } from "context/mapContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <PeakListProvider>
        <NewEntryProvider>
          <LogProvider>
            <StatsProvider>
              <MapProvider>
                <App />
              </MapProvider>
            </StatsProvider>
          </LogProvider>
        </NewEntryProvider>
      </PeakListProvider>
    </Router>
  </React.StrictMode>
);
