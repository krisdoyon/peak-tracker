import { Card, CardHeading, CardBody } from "components/Card";
import { PreviewControls } from "components/PreviewList";
import { FilterSelects } from "components/FilterSelects/FilterSelects";
import { StatsGrid } from "./StatsGrid/StatsGrid";
import { useStatsContext } from "context/statsContext";
import { useLogContext } from "context/logContext";
import { NoData } from "components/NoData/NoData";

export const Stats = () => {
  const { numberEntries } = useStatsContext();
  const {
    state: { logEntries },
  } = useLogContext();

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

  return (
    <Card>
      <CardHeading title={"Stats"} />
      <PreviewControls variant="stats">
        <FilterSelects card="stats" />
      </PreviewControls>
      <CardBody>
        {numberEntries > 0 && <StatsGrid />}
        {numberEntries === 0 && (
          <NoData message={message} hasAddButton={true} />
        )}
      </CardBody>
    </Card>
  );
};
