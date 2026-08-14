import { Button } from "../Button/Button";
import styles from "./PaginationButton.module.scss";

interface Props {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  variant: "next" | "prev";
  className?: string;
}

export const PaginationButton = ({
  onClick,
  variant,
  children,
  className,
}: Props) => {
  return (
    <Button
      onClick={onClick}
      className={`${styles.btn} ${styles[variant]} ${className || ""}`}
    >
      {children}
    </Button>
  );
};
