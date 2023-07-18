import { AddButton } from "components/Buttons";
import styles from "./NoData.module.scss";
import { LoginButton } from "layout/ControlPanel/ControlPanelButtons";

interface Props {
  message: JSX.Element;
  hasAddButton?: boolean;
  hasLoginButton?: boolean;
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
}

export const NoData = ({
  message,
  hasAddButton = false,
  hasLoginButton = false,
  onAdd,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      {message}
      {hasAddButton && <AddButton onClick={onAdd} />}
      {hasLoginButton && <LoginButton />}
    </div>
  );
};
