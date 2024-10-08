import { Card, CardHeading, CardBody } from "components/Card";
import { PreviewControls } from "components/PreviewList";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import { StatsGrid } from "./StatsGrid/StatsGrid";
import { NoData } from "components/NoData/NoData";
import { getStats } from "utils/getStats";
import { useFilteredLogEntries } from "hooks/useFilteredLogEntries";
import { useGetLogEntriesQuery } from "features/apiSlice";
import { LoadingSpinner } from "components/LoadingSpinner/LoadingSpinner";
import { useAppSelector } from "hooks/reduxHooks";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

export const Stats = () => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  const {
    data: allLogEntries,
    isLoading,
    error,
  } = useGetLogEntriesQuery(
    { userId, token, tripType: TripType.COMPLETED },
    { skip: userId === null || !isLoggedIn || token === null }
  );
  const filteredEntries = useFilteredLogEntries();
  const stats = getStats(filteredEntries);

  const message = (
    <p>
      {`You haven't added any log entries ${
        allLogEntries?.length === 0 ? "yet" : "that match the selected filters"
      }. ${
        allLogEntries?.length === 0 ? "Click" : "Adjust the filters or click"
      }
    the button below to log ${
      allLogEntries?.length === 0 ? "your first" : "a new"
    } entry! `}
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

  if (error) {
    return (
      <Card>
        <p>ERROR</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeading title={"Stats"} />
      <PreviewControls variant="stats">
        <FilterSelects card="stats" />
      </PreviewControls>
      <CardBody>
        {stats.numEntries > 0 && <StatsGrid {...stats} />}
        {stats.numEntries === 0 && (
          <NoData
            message={isLoggedIn ? message : loginMessage}
            hasAddButton={isLoggedIn ? true : false}
            hasLoginButton={isLoggedIn ? false : true}
          />
        )}
      </CardBody>
    </Card>
  );
};
