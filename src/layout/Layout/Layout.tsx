import { Outlet } from "react-router-dom";
import { Sidebar } from "layout/Sidebar/Sidebar";
import { Logo } from "components/Logo/Logo";
import { Map } from "pages/Map/Map";
import { LoadTestButton } from "./loadTestButton";

export const Layout = () => {
  return (
    <main>
      <Logo />
      <Map />
      <LoadTestButton />
      <Sidebar />
      <Outlet />
    </main>
  );
};
