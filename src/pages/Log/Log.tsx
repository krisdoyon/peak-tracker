import { Card, CardBody, CardHeading } from "components/Card";
import { PreviewList, PreviewControls } from "components/PreviewList";
import { LogPreview } from "./LogPreview/LogPreview";
import { LogActionKind, useLogContext } from "context/logContext";
import { PaginationButton } from "components/Buttons";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import { usePagination } from "hooks/usePagination";
import { NoData } from "components/NoData/NoData";
import { FilterType, ILogEntry } from "models/interfaces";

export const Log = () => {
  const {
    state: { logEntries },
    dispatch,
    filterLogEntries,
  } = useLogContext();

  const filteredEntries = filterLogEntries();

  const { page, maxPage, nextPage, prevPage, displayArr } = usePagination(
    filteredEntries,
    6
  );

  const noDataMessage = (
    <p>
      {`You haven't added any log entries ${
        logEntries.length === 0 ? "yet" : "that match the selected filters"
      }. ${logEntries.length === 0 ? "Click" : "Adjust the filters or click"}
        the button below to log ${
          logEntries.length === 0 ? "your first" : "a new"
        } entry!
        `}
    </p>
  );

  const updateFilters = (filter: FilterType, value: string) => {
    dispatch({
      type: LogActionKind.UPDATE_FILTERS,
      payload: { filter, value },
    });
  };

  return (
    <Card>
      <CardHeading title={"Trip Log"} />
      <PreviewControls variant="log">
        {page !== 1 && (
          <PaginationButton variant="prev" onClick={prevPage}>{`Page ${
            page - 1
          }`}</PaginationButton>
        )}
        <FilterSelects card="log" updateFilters={updateFilters} />
        {page < maxPage && (
          <PaginationButton variant="next" onClick={nextPage}>{`Page ${
            page + 1
          }`}</PaginationButton>
        )}
      </PreviewControls>
      <CardBody>
        {displayArr.length > 0 && (
          <PreviewList>
            {displayArr.map((entry) => {
              return <LogPreview key={entry.logID} {...entry} />;
            })}
          </PreviewList>
        )}
        {displayArr.length === 0 && (
          <NoData message={noDataMessage} hasAddButton={true} />
        )}
      </CardBody>
    </Card>
  );
};
