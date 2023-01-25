import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { NewEntryProvider } from "context/newEntryContext";
import { BrowserRouter as Router } from "react-router-dom";
import { MapProvider } from "context/mapContext";
import { FilterProvider } from "context/filterContext";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { apiSlice } from "features/apiSlice";
import { SidebarProvider } from "context/sidebarContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <ApiProvider api={apiSlice}>
        <NewEntryProvider>
          <MapProvider>
            <FilterProvider>
              <SidebarProvider>
                <App />
              </SidebarProvider>
            </FilterProvider>
          </MapProvider>
        </NewEntryProvider>
      </ApiProvider>
    </Router>
  </React.StrictMode>
);
