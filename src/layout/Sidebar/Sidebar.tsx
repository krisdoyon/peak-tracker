import styles from "./Sidebar.module.scss";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import sprite from "assets/img/sprite.svg";
import { navLinks } from "./navLinks";

export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {};

  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navLinks.map((link, i) => {
            return (
              <li key={i} className={styles["list-item"]}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.active} ${styles["nav-btn"]}`
                      : `${styles["nav-btn"]}`
                  }
                >
                  <span>{link.text}</span>
                  <svg className={styles.icon}>
                    <use href={`${sprite}#icon-${link.icon}`}></use>
                  </svg>
                </NavLink>
              </li>
            );
          })}
          <li className={styles["list-item"]}>
            <button id="nav-btn-about" className={styles["nav-btn"]}>
              <span>About</span>
              <svg className={styles.icon}>
                <use href={`${sprite}#icon-info`}></use>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
      <div className={styles["sidebar-wrapper"]}>
        <button className={styles["sidebar-btn"]} aria-label="toggle sidebar">
          <svg className={styles.icon}>
            <use href={`${sprite}#icon-chevron-left`}></use>
          </svg>
        </button>
        <p className={styles.copyright}>&copy; 2022 Kris Doyon</p>
      </div>
    </div>
  );
};
