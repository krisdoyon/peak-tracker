import styles from "./CardBody.module.scss";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: Props) => {
  return (
    <div className={`${styles.wrapper} ${className ? className : ""}`}>
      {children}
    </div>
  );
};
