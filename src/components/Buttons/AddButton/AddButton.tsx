import styles from "./AddButton.module.scss";
import sprite from "assets/img/sprite.svg";
import { Button } from "components/Buttons";
import { useNavigate } from "react-router-dom";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const AddButton = ({
  onClick,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  let handleClick;
  if (onClick) {
    handleClick = onClick;
  } else {
    const navigate = useNavigate();
    handleClick = () => {
      navigate("/new-entry");
    };
  }

  return (
    <Button onClick={handleClick} className={styles.btn} {...rest}>
      <span>Add</span>
      <svg className={styles.icon}>
        <use href={`${sprite}#icon-plus`}></use>
      </svg>
    </Button>
  );
};
