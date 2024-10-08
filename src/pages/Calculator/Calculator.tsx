import { Card, CardHeading, CardBody } from "components/Card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tab, Tabs, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "components/Buttons";
import styles from "./Calculator.module.scss";

type PaceType = {
  name: string;
  multiplier: number;
};

type TrailDifficultyType = {
  name: string;
  multiplier: number;
};

const paceOptions: PaceType[] = [
  { name: "Slow", multiplier: 1.2 },
  { name: "Normal", multiplier: 1 },
  { name: "Fast", multiplier: 0.85 },
  { name: "Run", multiplier: 0.7 },
];

const difficultyOptions: TrailDifficultyType[] = [
  { name: "Easy", multiplier: 0.8 },
  { name: "Normal", multiplier: 1 },
  { name: "Difficult", multiplier: 1.25 },
];

export const Calculator = () => {
  const [distance, setDistance] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [pace, setPace] = useState<PaceType["name"]>("Slow");
  const [difficulty, setDifficulty] =
    useState<TrailDifficultyType["name"]>("Normal");
  const [restTime, setRestTime] = useState(0);

  const paceMultiplier = useMemo(
    () => paceOptions.find((item) => item.name === pace)?.multiplier || 1,
    [pace]
  );

  const difficultyMultiplier = useMemo(
    () =>
      difficultyOptions.find((item) => item.name === difficulty)?.multiplier ||
      1,
    [difficulty]
  );

  const calculateTimeInMinutes = useCallback(() => {
    const distanceTime = distance * 30; // distance in miles x 20 mins / mile
    const elevationTime = (elevation / 2000) * 60; // elevation in feet x 1 hr / 2000 ft
    const timeInMinutes =
      (distanceTime + elevationTime) * paceMultiplier * difficultyMultiplier +
      restTime;

    return timeInMinutes;
  }, [distance, elevation, paceMultiplier, difficultyMultiplier, restTime]);

  const { hours, minutes, avgSpeed } = useMemo(() => {
    const timeInMinutes = calculateTimeInMinutes();
    const timeInHours = timeInMinutes / 60;
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = Math.round(timeInMinutes % 60);
    let avgSpeed = (timeInHours > 0 ? distance / timeInHours : 0).toFixed(2);
    return { hours, minutes, avgSpeed };
  }, [calculateTimeInMinutes, distance]);

  // const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setTabIdx(+newValue);
  // };

  return (
    <CardBody className={styles.body}>
      <div>
        Assumes 3 MPH walking speed (20 mins per mile) and 30 mins for every
        1000 ft
      </div>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          Distance
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={distance}
            onChange={(e) => setDistance(+e.target.value)}
          />
        </Grid>
        <Grid item xs={2} alignSelf="center">
          miles
        </Grid>
        <Grid item xs={6}>
          Elevation
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={elevation}
            onChange={(e) => setElevation(+e.target.value)}
          />
        </Grid>
        <Grid item xs={2} alignSelf="center">
          <span>feet</span>
        </Grid>
        <Grid item xs={6}>
          Rest time
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={restTime}
            onChange={(e) => setRestTime(+e.target.value)}
          />
        </Grid>
        <Grid item xs={2} alignSelf="center">
          <span>minutes</span>
        </Grid>
      </Grid>
      <h3>Pace</h3>
      <Grid container style={{ padding: 20 }}>
        {paceOptions.map((item) => {
          const { name } = item;
          const isActive = pace === name;
          return (
            <Grid key={name} item xs={3} textAlign="center">
              <Button
                className={`${styles.button} ${isActive ? styles.active : ""}`}
                onClick={() => setPace(name)}
              >
                {name}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      <h3>Trail conditions</h3>
      <Grid container style={{ padding: 20 }}>
        {difficultyOptions.map((item) => {
          const { name } = item;
          const isActive = difficulty === name;
          return (
            <Grid key={name} item xs={4} textAlign="center">
              <Button
                className={`${styles.button} ${isActive ? styles.active : ""}`}
                onClick={() => setDifficulty(name)}
              >
                {name}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      <h3>Multiplier</h3>
      <div>{difficultyMultiplier * paceMultiplier}</div>
      <h3>Time</h3>
      <div>{`${hours} hours, ${minutes} minutes`}</div>
      <h3>Avg speed</h3>
      <div>{`${avgSpeed} MPH`}</div>
    </CardBody>
  );
};
