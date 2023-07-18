import styles from "./PreviewList.module.scss";

interface Props {
  children?: React.ReactNode;
}

export const PreviewList = ({ children }: Props) => {
  return <ul className={styles.list}>{children}</ul>;
};
