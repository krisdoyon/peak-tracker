import { Outlet } from "react-router-dom";
import { Sidebar } from "layout/Sidebar/Sidebar";
import { Map } from "pages/Map/Map";
import { ControlPanel } from "layout/ControlPanel/ControlPanel";

export const Layout = () => {
  return (
    <main>
      <ControlPanel />
      <Map />
      <Sidebar />
      <Outlet />
    </main>
  );
};
