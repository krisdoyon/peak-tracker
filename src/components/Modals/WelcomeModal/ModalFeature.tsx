import styles from "./WelcomeModal.module.scss";
import sprite from "assets/img/sprite.svg";

interface FeatureProps {
  icon: string;
  heading: string;
  text: string;
}

export const ModalFeature = ({ icon, heading, text }: FeatureProps) => {
  return (
    <div className={styles.feature}>
      <svg className={styles["feature-icon"]}>
        <use href={`${sprite}#icon-${icon}`}></use>
      </svg>
      <h3 className={styles["feature-heading"]}>{heading}</h3>
      <p className={styles["feature-text"]}>{text}</p>
    </div>
  );
};
