import styles from "./ViewButton.module.scss";
import { Button } from "components/Buttons";
import { useNavigate } from "react-router-dom";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  small?: boolean;
}

export const ViewButton = ({ onClick, small = false }: Props) => {
  const navigate = useNavigate();
  return (
    <Button
      className={`${styles.view}  ${small ? styles.small : ""}`}
      onClick={onClick}
    >
      view
    </Button>
  );
};
