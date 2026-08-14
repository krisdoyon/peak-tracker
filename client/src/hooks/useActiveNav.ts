import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useLocation } from "react-router-dom";
import { navLinks } from "layout/Sidebar/navLinks";
import { setActiveNav } from "features/sidebarSlice";

export const useActiveNav = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    navLinks.forEach((navLink) => {
      if (pathname.includes(navLink.to)) {
        dispatch(setActiveNav(navLink.active));
      }
    });
  }, [pathname]);
};
