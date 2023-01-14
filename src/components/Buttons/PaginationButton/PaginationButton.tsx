import { Button } from "../Button/Button";
import styles from "./PaginationButton.module.scss";

interface Props {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  variant: "next" | "prev";
}

export const PaginationButton = ({ onClick, variant, children }: Props) => {
  return (
    <Button onClick={onClick} className={`${styles.btn} ${styles[variant]}`}>
      {children}
    </Button>
  );
};
