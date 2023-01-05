import { Outlet } from "react-router-dom";
import { Sidebar } from "layout/Sidebar/Sidebar";

export const Layout = () => {
  return (
    <main>
      <Sidebar />
      <Outlet />
    </main>
  );
};
