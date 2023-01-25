import { createContext, useContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export interface IFilterState {
  listID: string;
  year: string;
  month: string;
}

interface IFilterContext {
  filters: IFilterState;
  setFilters: React.Dispatch<React.SetStateAction<IFilterState>>;
}

const filterContext = createContext<IFilterContext | null>(null);

export const FilterProvider = ({ children }: Props) => {
  const initialFilters: IFilterState = {
    listID: "all",
    year: "all",
    month: "all",
  };
  const [filters, setFilters] = useState(initialFilters);

  return (
    <filterContext.Provider value={{ filters, setFilters }}>
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
