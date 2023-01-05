import styles from "./PeakLists.module.scss";
import { useState } from "react";
import { Card, CardBody, CardHeading } from "components/Card";
import { TextButton } from "components/Buttons";
import { PreviewList } from "components/PreviewList/PreviewList";
import { PreviewListItem } from "components/PreviewList/PreviewListItem/PreviewListItem";

export const PeakLists = () => {
  const [previewType, setPreviewType] = useState<"all" | "saved">("all");

  return (
    <Card>
      <CardHeading title="Peak Lists" />
      <div className={styles.controls}>
        <TextButton
          className={styles["btn-all"]}
          color="light"
          active={previewType === "all"}
          onClick={() => setPreviewType("all")}
        >
          all lists
        </TextButton>
        <TextButton
          className={styles["btn-saved"]}
          color="light"
          active={previewType === "saved"}
          onClick={() => setPreviewType("saved")}
        >
          saved lists
        </TextButton>
      </div>
      <CardBody>
        <PreviewList>
          <PreviewListItem
            heading="Adirondack High Peaks"
            numCompleted={3}
            peakCount={46}
            variant="peak-list"
          />
        </PreviewList>
      </CardBody>
    </Card>
  );
};
