import { createContext, useContext, useMemo, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface ISidebarContext {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebarContext = createContext<ISidebarContext | null>(null);

export const SidebarProvider = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const contextValue = useMemo(
    () => ({ sidebarOpen, setSidebarOpen }),
    [sidebarOpen, setSidebarOpen]
  );

  return (
    <sidebarContext.Provider value={contextValue}>
      {children}
    </sidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(sidebarContext);
  if (context === null) {
    throw new Error("useSidebarContext must be used within SidebarProvider");
  }
  return context;
};
