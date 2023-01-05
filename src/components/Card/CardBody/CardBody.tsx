import styles from "./CardBody.module.scss";

interface Props {
  children?: React.ReactNode;
}

export const CardBody = ({ children }: Props) => {
  return <div className={styles.wrapper}>{children}</div>;
};
