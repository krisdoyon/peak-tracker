import styles from "./Log.module.scss";
import { Card, CardBody, CardHeading } from "components/Card";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import {
  PreviewList,
  PreviewListItem,
  PreviewControls,
} from "components/PreviewList";

export const Log = () => {
  return (
    <Card>
      <CardHeading title={"Trip Log"} />
      <PreviewControls variant="log" />
      <CardBody>
        <PreviewList>
          <PreviewListItem
            heading="August 29, 2022"
            numCompleted={3}
            peakCount={46}
            variant="log-entry"
          ></PreviewListItem>
        </PreviewList>
      </CardBody>
    </Card>
  );
};
