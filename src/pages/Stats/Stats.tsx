import { Card, CardHeading, CardBody } from "components/Card";
import { PreviewControls } from "components/PreviewList";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import { StatsGrid } from "./StatsGrid/StatsGrid";
import { useLogContext } from "context/logContext";
import { NoData } from "components/NoData/NoData";
import { getStats } from "utils/getStats";
import { FilterType } from "models/interfaces";
import { useState } from "react";

export const Stats = () => {
  const [filters, setFilters] = useState({
    listID: "all",
    month: "all",
    year: "all",
  });

  const {
    state: { logEntries },
    filterLogEntries,
  } = useLogContext();

  const filteredEntries = filterLogEntries(filters);

  const stats = getStats(filteredEntries);

  const message = (
    <p>
      {`You haven't added any log entries ${
        logEntries.length === 0 ? "yet" : "that match the selected filters"
      }. ${logEntries.length === 0 ? "Click" : "Adjust the filters or click"}
    the button below to log ${
      logEntries.length === 0 ? "your first" : "a new"
    } entry! `}
    </p>
  );

  const updateFilters = (filter: FilterType, value: string) => {
    const newFilters = { ...filters, [filter]: value };
    setFilters(newFilters);
  };

  return (
    <Card>
      <CardHeading title={"Stats"} />
      <PreviewControls variant="stats">
        <FilterSelects
          card="stats"
          updateFilters={updateFilters}
          filterValues={filters}
        />
      </PreviewControls>
      <CardBody>
        {stats.numEntries > 0 && <StatsGrid {...stats} />}
        {stats.numEntries === 0 && (
          <NoData message={message} hasAddButton={true} />
        )}
      </CardBody>
    </Card>
  );
};
