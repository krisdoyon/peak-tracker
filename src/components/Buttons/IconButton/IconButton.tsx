import styles from "./IconButton.module.scss";
import sprite from "assets/img/sprite.svg";

interface Props {
  icon: string;
}

export const IconButton = ({ icon }: Props) => {
  return (
    <button className={styles.btn}>
      <svg className={styles.icon}>
        <use href={`${sprite}#icon-${icon}`}></use>
      </svg>
    </button>
  );
};
