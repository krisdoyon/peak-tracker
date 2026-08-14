import styles from "./CardHeading.module.scss";

interface Props {
  title: string;
  bottomBorder?: boolean;
}

export const CardHeading = ({ title, bottomBorder = false }: Props) => {
  return (
    <div
      className={`${styles.wrapper} ${
        bottomBorder ? styles["border-bottom"] : ""
      }`}
    >
      <h2>{title}</h2>
    </div>
  );
};
