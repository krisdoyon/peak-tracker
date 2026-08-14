import styles from "./LoadingSpinner.module.scss";
import sprite from "assets/img/sprite.svg";

export const LoadingSpinner = () => {
  return (
    <div className={styles.wrapper}>
      <svg className={styles.icon}>
        <use href={`${sprite}#icon-spinner`}></use>
      </svg>
    </div>
  );
};
