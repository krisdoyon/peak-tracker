import { Card, CardBody, CardHeading } from "components/Card";
import { PreviewList, PreviewControls } from "components/PreviewList";
// import { LogPreview } from "./LogPreview/LogPreview";
import styles from "./Planner.module.scss";

import { AddButton, PaginationButton } from "components/Buttons";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import { usePagination } from "hooks/usePagination";
import { NoData } from "components/NoData/NoData";
import { useFilteredLogEntries } from "hooks/useFilteredLogEntries";
import { useFiltersReset } from "hooks/useFiltersReset";
import { LoadingSpinner } from "components/LoadingSpinner/LoadingSpinner";
import { useGetLogEntriesQuery } from "features/apiSlice";
import { useAppSelector } from "hooks/reduxHooks";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";
import { LogPreview } from "pages/Log/LogPreview/LogPreview";

export const Planner = () => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  const {
    data: allPlannedTrips,
    isLoading,
    isError,
    error,
  } = useGetLogEntriesQuery(
    { userId, token, tripType: TripType.PLANNED },
    { skip: userId === null || !isLoggedIn || token === null }
  );

  // const filteredEntries = useFilteredLogEntries();

  const { page, maxPage, nextPage, prevPage, displayArr } = usePagination(
    allPlannedTrips,
    6
  );

  // useFiltersReset();

  const noDataMessage = (
    <p>
      {`You haven't added any planned trips yet. Use the button above to add your first trip plan!`}
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
      <CardHeading title={"Planner"} />
      {/* <PreviewControls variant="log"> */}
      <div className={styles.pagination}>
        {page !== 1 && (
          <PaginationButton
            variant="prev"
            onClick={prevPage}
            className={styles.button}
          >{`Page ${page - 1}`}</PaginationButton>
        )}
        {/* <FilterSelects card="log" /> */}
        {page < maxPage && (
          <PaginationButton
            variant="next"
            onClick={nextPage}
            className={styles.button}
          >{`Page ${page + 1}`}</PaginationButton>
        )}
      </div>
      {/* </PreviewControls> */}
      <CardBody>
        {/* <AddButton /> */}
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
            hasAddButton={isLoggedIn}
            hasLoginButton={!isLoggedIn}
          />
        )}
      </CardBody>
    </Card>
  );
};
