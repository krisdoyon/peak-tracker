import { Card, CardHeading, CardBody } from "components/Card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tab, Tabs, TextField } from "@mui/material";
import { Calculator } from "pages";
import { GearList } from "pages/GearList/GearList";

export const Tools = () => {
  const [tabIdx, setTabIdx] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIdx(newValue);
  };

  return (
    <Card>
      <CardHeading title={"Tools"} />
      <CardBody>
        <Tabs
          value={tabIdx}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label={"Gear list"} />
          <Tab label={"Calculator"} />
        </Tabs>
        {tabIdx === 0 && <GearList />}
        {tabIdx === 1 && <Calculator />}
      </CardBody>
    </Card>
  );
};
