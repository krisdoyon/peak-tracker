import styles from "./ViewButton.module.scss";
import { Button } from "components/Buttons";
import { useNavigate } from "react-router-dom";

interface Props {
  to: string;
  className?: string;
  small?: boolean;
}

export const ViewButton = ({ to, small = false }: Props) => {
  const navigate = useNavigate();
  return (
    <Button
      className={`${styles.view}  ${small ? styles.small : ""}`}
      onClick={() => navigate(to)}
    >
      view
    </Button>
  );
};
