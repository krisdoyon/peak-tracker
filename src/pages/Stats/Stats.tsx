import styles from "./Stats.module.scss";
import { Card, CardHeading, CardBody } from "components/Card";
import { PreviewControls } from "components/PreviewList";

export const Stats = () => {
  return (
    <Card>
      <CardHeading title={"Stats"} />
      <PreviewControls variant="stats" />
      <CardBody></CardBody>
    </Card>
  );
};
