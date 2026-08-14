import styles from "../AddButton/AddButton.module.scss";
import sprite from "assets/img/sprite.svg";
import { Button } from "components/Buttons";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ModifyButton = ({
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button className={styles.btn} {...rest}>
      <span>Modify</span>
      <svg className={styles.icon}>
        <use href={`${sprite}#icon-modify`}></use>
      </svg>
    </Button>
  );
};
