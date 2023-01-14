import styles from "./IconButton.module.scss";
import sprite from "assets/img/sprite.svg";

interface Props {
  icon: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  small?: boolean;
}

export const IconButton = ({
  icon,
  onClick,
  className,
  small = false,
}: Props) => {
  return (
    <button
      className={`${styles.btn} ${className ? className : ""}`}
      onClick={onClick}
    >
      <svg className={`${styles.icon} ${small ? styles.small : ""}`}>
        <use href={`${sprite}#icon-${icon}`}></use>
      </svg>
    </button>
  );
};
