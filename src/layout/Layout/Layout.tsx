import { Outlet } from "react-router-dom";
import { Sidebar } from "layout/Sidebar/Sidebar";
import { Logo } from "components/Logo/Logo";
import { Map } from "pages/Map/Map";

export const Layout = () => {
  return (
    <main>
      <Logo />
      <Map />
      <Sidebar />
      <Outlet />
    </main>
  );
};
