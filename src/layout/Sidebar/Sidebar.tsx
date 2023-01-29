import styles from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import sprite from "assets/img/sprite.svg";
import { navLinks } from "./navLinks";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { toggleSidebar } from "features/sidebarSlice";

export const Sidebar = () => {
  const { sidebarOpen } = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();

  return (
    <div className={`${styles.sidebar} ${sidebarOpen ? "" : styles.hidden}`}>
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
