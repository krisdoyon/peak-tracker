import React, { createContext, useContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface IFilterState {
  listID: string;
  year: string;
  month: string;
}

interface IFilterContext {
  logFilters: IFilterState;
  setLogFilters: React.Dispatch<React.SetStateAction<IFilterState>>;
  statsFilters: IFilterState;
  setStatsFilters: React.Dispatch<React.SetStateAction<IFilterState>>;
}

const filterContext = createContext<IFilterContext | null>(null);

export const FilterProvider = ({ children }: Props) => {
  const initialFilters = {
    listID: "all",
    year: "all",
    month: "all",
  };
  const [logFilters, setLogFilters] = useState(initialFilters);
  const [statsFilters, setStatsFilters] = useState(initialFilters);

  return (
    <filterContext.Provider
      value={{ logFilters, setLogFilters, statsFilters, setStatsFilters }}
    >
      {children}
    </filterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(filterContext);
  if (context === null) {
    throw new Error("useFilterContext must be used within FilterProvider");
  }
  return context;
};
