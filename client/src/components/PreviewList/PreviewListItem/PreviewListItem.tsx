import styles from "./PreviewListItem.module.scss";

interface Props {
  children: React.ReactNode;
}

export const PreviewListItem = ({ children }: Props) => {
  return <li className={styles.item}>{children}</li>;
};
