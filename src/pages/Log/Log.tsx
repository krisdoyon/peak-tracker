import { Card, CardBody, CardHeading } from "components/Card";
import { PreviewList, PreviewControls } from "components/PreviewList";
import { LogPreview } from "./LogPreview/LogPreview";
import { LogActionKind, useLogContext } from "context/logContext";
import { PaginationButton } from "components/Buttons";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import { usePagination } from "hooks/usePagination";
import { NoData } from "components/NoData/NoData";
import { FilterType } from "models/interfaces";
import { useEffect } from "react";

export const Log = () => {
  const {
    state: { logEntries, filters },
    dispatch,
    filterLogEntries,
    getFilterSelectOptions,
  } = useLogContext();

  const { lists, months, years } = getFilterSelectOptions();

  const filteredEntries = filterLogEntries(filters);

  const { page, maxPage, nextPage, prevPage, displayArr } = usePagination(
    filteredEntries,
    6
  );

  useEffect(() => {
    if (
      filters.listID !== "all" &&
      !lists.some((list) => list.listID === filters.listID)
    ) {
      dispatch({
        type: LogActionKind.UPDATE_FILTERS,
        payload: { filter: "listID", value: "all" },
      });
    }
    if (
      filters.month !== "all" &&
      !months.some((month) => month.numeric === filters.month)
    ) {
      dispatch({
        type: LogActionKind.UPDATE_FILTERS,
        payload: { filter: "month", value: "all" },
      });
    }
    if (filters.year !== "all" && !years.includes(filters.year)) {
      dispatch({
        type: LogActionKind.UPDATE_FILTERS,
        payload: { filter: "year", value: "all" },
      });
    }
  }, [lists, months, years]);

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
        <FilterSelects
          card="log"
          updateFilters={updateFilters}
          filterValues={filters}
        />
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
