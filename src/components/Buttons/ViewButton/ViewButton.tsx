import styles from "./ViewButton.module.scss";
import { Button } from "components/Buttons";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  small?: boolean;
}

export const ViewButton = ({ onClick, small = false }: Props) => {
  return (
    <Button
      className={`${styles.view}  ${small ? styles.small : ""}`}
      onClick={onClick}
    >
      view
    </Button>
  );
};
