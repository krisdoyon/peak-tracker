import styles from "./Button.module.scss";

interface Props {
  variant?: "add" | "view";
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ variant, className, children, onClick }: Props) => {
  return (
    <button
      className={`${styles.btn} ${className ? className : ""} ${
        variant ? styles[variant] : ""
      }`}
      onClick={onClick}
    >
      {variant === "add" && <></>}
      {variant === "view" && <>view</>}

      {children}
    </button>
  );
};
