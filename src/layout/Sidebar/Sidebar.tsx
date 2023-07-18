import styles from "./Sidebar.module.scss";
import sprite from "assets/img/sprite.svg";
import { navLinks } from "./navLinks";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { toggleSidebar } from "features/sidebarSlice";
import { ModalType, openModal } from "features/modalSlice";
import { useAppNavigate } from "hooks/useAppNaviage";
import { useState } from "react";
import { NavLinksEnum } from "./navLinks";

const getActiveNavLink = () => {
  const pathname = window.location.pathname;
  const matchingLink = navLinks.find((link) => link.to === pathname);
  return matchingLink?.active || NavLinksEnum.MAP;
};

export const Sidebar = () => {
  const { sidebarOpen, activeNav } = useAppSelector((state) => state.sidebar);
  const navigate = useAppNavigate();
  const dispatch = useAppDispatch();
  // const [activeLink, setActiveLink] = useState(getActiveNavLink());

  // const handleNavClick = (navLink: any) => {
  //   navigate(navLink.to);
  //   // if (navigationSuccess) setActiveLink(navLink.active);
  // };

  return (
    <div className={`${styles.sidebar} ${sidebarOpen ? "" : styles.hidden}`}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navLinks.map((link, i) => {
            return (
              <li key={i} className={styles["list-item"]}>
                <a
                  onClick={() => {
                    navigate(link.to);
                  }}
                  className={
                    activeNav === link.active
                      ? `${styles.active} ${styles["nav-btn"]}`
                      : `${styles["nav-btn"]}`
                  }
                >
                  <span>{link.text}</span>
                  <svg className={styles.icon}>
                    <use href={`${sprite}#icon-${link.icon}`}></use>
                  </svg>
                </a>
              </li>
            );
          })}
          <li className={styles["list-item"]}>
            <button
              id="nav-btn-about"
              className={styles["nav-btn"]}
              onClick={() => dispatch(openModal(ModalType.WELCOME))}
            >
              <span>About</span>
              <svg className={styles.icon}>
                <use href={`${sprite}#icon-info`}></use>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
      <div className={styles["sidebar-wrapper"]}>
        <button
          className={styles["sidebar-btn"]}
          aria-label="toggle sidebar"
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg className={styles.icon}>
            <use
              href={`${sprite}#icon-chevron-${sidebarOpen ? "left" : "right"}`}
            ></use>
          </svg>
        </button>
        <a
          href="https://krisdoyon.com"
          className={styles.copyright}
          target="_blank"
        >
          &copy; 2022 Kris Doyon
        </a>
      </div>
    </div>
  );
};
