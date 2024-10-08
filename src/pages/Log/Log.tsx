import { Card, CardBody, CardHeading } from "components/Card";
import { PreviewList, PreviewControls } from "components/PreviewList";
import { LogPreview } from "./LogPreview/LogPreview";
import { PaginationButton } from "components/Buttons";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import { usePagination } from "hooks/usePagination";
import { NoData } from "components/NoData/NoData";
import { useFilteredLogEntries } from "hooks/useFilteredLogEntries";
import { useFiltersReset } from "hooks/useFiltersReset";
import { LoadingSpinner } from "components/LoadingSpinner/LoadingSpinner";
import { useGetLogEntriesQuery } from "features/apiSlice";
import { useAppSelector } from "hooks/reduxHooks";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

export const Log = () => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  const {
    data: allLogEntries,
    isLoading,
    isError,
    error,
  } = useGetLogEntriesQuery(
    { userId, token, tripType: TripType.COMPLETED },
    { skip: userId === null || !isLoggedIn || token === null }
  );

  const filteredEntries = useFilteredLogEntries();

  const { page, maxPage, nextPage, prevPage, displayArr } = usePagination(
    filteredEntries,
    6
  );

  useFiltersReset();

  const noDataMessage = (
    <p>
      {`You haven't added any log entries ${
        allLogEntries?.length === 0 ? "yet" : "that match the selected filters"
      }. ${
        allLogEntries?.length === 0 ? "Click" : "Adjust the filters or click"
      }
        the button below to log ${
          allLogEntries?.length === 0 ? "your first" : "a new"
        } entry!
        `}
    </p>
  );

  const loginMessage = (
    <p>
      Login or create an account <br />
      to start recording log entries!
    </p>
  );

  if (isLoading) {
    return (
      <Card>
        <LoadingSpinner />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <p>ERROR</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeading title={"Trip Log"} />
      <PreviewControls variant="log">
        {page !== 1 && (
          <PaginationButton variant="prev" onClick={prevPage}>{`Page ${
            page - 1
          }`}</PaginationButton>
        )}
        <FilterSelects card="log" />
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
              return <LogPreview key={entry.logId} {...entry} />;
            })}
          </PreviewList>
        )}
        {displayArr.length === 0 && (
          <NoData
            message={isLoggedIn ? noDataMessage : loginMessage}
            hasAddButton={isLoggedIn ? true : false}
            hasLoginButton={isLoggedIn ? false : true}
          />
        )}
      </CardBody>
    </Card>
  );
};
