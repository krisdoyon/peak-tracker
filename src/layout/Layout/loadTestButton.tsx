import { Button } from "components/Buttons";
import { useSetTestLogEntriesMutation } from "features/apiSlice";
import { useNavigate } from "react-router-dom";

const USER_ID = "abc123";

export const LoadTestButton = () => {
  const [setTestLogEntries] = useSetTestLogEntriesMutation();
  const navigate = useNavigate();

  const handleLoad = () => {
    if (
      confirm("This action will overwrite all existing log entries. Continue?")
    ) {
      setTestLogEntries(USER_ID);
      navigate("/log");
    }
  };

  return (
    <Button
      style={{
        position: "absolute",
        right: "1.4rem",
        padding: "1rem 2rem",
        top: "15rem",
      }}
      onClick={handleLoad}
    >
      LOAD TEST
    </Button>
  );
};
