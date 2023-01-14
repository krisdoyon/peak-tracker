import { AddButton } from "components/Buttons";
import styles from "./NoData.module.scss";

interface Props {
  message: JSX.Element;
  hasAddButton?: boolean;
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
}

export const NoData = ({ message, hasAddButton = false, onAdd }: Props) => {
  return (
    <div className={styles.wrapper}>
      {message}
      {hasAddButton && <AddButton onClick={onAdd} />}
    </div>
  );
};
