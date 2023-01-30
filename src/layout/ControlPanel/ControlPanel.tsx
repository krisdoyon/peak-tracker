import { Logo } from "layout/Logo/Logo";
import { useState } from "react";
import styles from "./ControlPanel.module.scss";
import {
  ClearMapButton,
  LoadTestButton,
  PlotAllButton,
  PlotCompletedButton,
} from "./ControlPanelButtons";

export const ControlPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={styles.wrapper}>
      <Logo />
      <div className={styles.controls}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles["btn-expand"]}
        >
          {isOpen ? "Hide" : "Open"}
        </button>
        <div className={styles["btn-wrapper"]}>
          <div
            className={`${styles["btn-container"]} ${
              isOpen ? styles.open : ""
            }`}
          >
            <LoadTestButton />
            <PlotAllButton />
            <PlotCompletedButton />
            <ClearMapButton />
          </div>
        </div>
      </div>
    </div>
  );
};
