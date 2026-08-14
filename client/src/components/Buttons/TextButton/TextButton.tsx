import styles from "./TextButton.module.scss";

interface Props {
  color?: "light" | "green";
  children?: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const TextButton = ({
  color,
  children,
  className,
  active,
  onClick,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${styles.btn} ${className ? className : ""} ${
        active ? styles.active : ""
      } ${color ? styles[color] : ""}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
