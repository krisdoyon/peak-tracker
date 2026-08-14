import { FilterSelects } from "components/FilterSelects/FilterSelects";
import styles from "./PreviewControls.module.scss";

interface Props {
  children?: React.ReactNode;
  variant: "log" | "peak-lists" | "stats";
}

export const PreviewControls = ({ children, variant }: Props) => {
  return (
    <div
      className={`${styles.wrapper} ${
        variant === "peak-lists" ? styles["peak-lists"] : ""
      }${variant === "log" || variant === "stats" ? styles.selects : ""}
      ${variant === "log" ? styles.log : ""}
      ${variant === "stats" ? styles.stats : ""}`}
    >
      {children}
    </div>
  );
};
