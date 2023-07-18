import styles from "./Logo.module.scss";
import logo from "assets/img/logo.png";

export const Logo = () => {
  return <img className={styles.logo} src={logo} alt="Peak Tracker logo" />;
};
