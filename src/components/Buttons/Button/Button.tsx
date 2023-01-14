import styles from "./Button.module.scss";

interface Props {
  className?: string;
  children?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({
  className,
  children,
  onClick,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${styles.btn} ${className ? className : ""}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
