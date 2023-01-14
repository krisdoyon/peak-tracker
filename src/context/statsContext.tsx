import { createContext, useContext } from "react";

interface Props {
  children: React.ReactNode;
}

interface IStatsContext {
  numberEntries: number;
  numberPeaks: number;
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
}

const statsContext = createContext<IStatsContext | null>(null);

export const StatsProvider = ({ children }: Props) => {
  return (
    <statsContext.Provider
      value={{
        numberEntries: 3,
        numberPeaks: 3,
        totalDistance: 50,
        totalElevation: 40000,
        totalTime: 20.5,
      }}
    >
      {children}
    </statsContext.Provider>
  );
};

export const useStatsContext = () => {
  const context = useContext(statsContext);
  if (context === null) {
    throw new Error("useStatsContext must be used within StatsProvider");
  }
  return context;
};
