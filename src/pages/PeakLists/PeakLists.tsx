import styles from "./PeakLists.module.scss";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeading } from "components/Card";
import { TextButton, PaginationButton } from "components/Buttons";
import { PreviewList, PreviewControls } from "components/PreviewList";
import { PeakListPreview } from "./PeakListPreview/PeakListPreview";
import { usePeakListContext } from "context/peakListContext";
import { usePagination } from "hooks/usePagination";
import { NoData } from "components/NoData/NoData";

const noDataMessage = (
  <p>
    You haven't saved any peak lists yet. <br />
    Click "all lists" above to get started!
  </p>
);

export const PeakLists = () => {
  const [previewType, setPreviewType] = useState<"all" | "saved">("all");
  const { allPeakLists, savedListIds } = usePeakListContext();

  const displayLists =
    previewType === "all"
      ? allPeakLists
      : allPeakLists.filter((list) => savedListIds.includes(list.listID));

  const { page, maxPage, displayArr, nextPage, prevPage, setPage } =
    usePagination(displayLists, 6);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [previewType]);

  return (
    <Card>
      <CardHeading title="Peak Lists" />
      <PreviewControls variant="peak-lists">
        {page !== 1 && (
          <PaginationButton variant="prev" onClick={prevPage}>
            {`Page ${page - 1}`}
          </PaginationButton>
        )}
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
        {page < maxPage && (
          <PaginationButton variant="next" onClick={nextPage}>
            {`Page ${page + 1}`}
          </PaginationButton>
        )}
      </PreviewControls>
      <CardBody>
        {displayArr.length > 0 && (
          <PreviewList>
            {displayArr.map((peakList) => {
              const { title, peakCount, listID } = peakList;
              return (
                <PeakListPreview
                  key={listID}
                  title={title}
                  peakCount={peakCount}
                  listID={listID}
                  numCompleted={3}
                />
              );
            })}
          </PreviewList>
        )}
        {previewType === "saved" && displayLists.length === 0 && (
          <NoData message={noDataMessage} />
        )}
      </CardBody>
    </Card>
  );
};
