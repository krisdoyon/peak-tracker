import styles from "./CardHeading.module.scss";

interface Props {
  title: string;
}

export const CardHeading = ({ title }: Props) => {
  return (
    <div className={styles.wrapper}>
      <h2>{title}</h2>
    </div>
  );
};
