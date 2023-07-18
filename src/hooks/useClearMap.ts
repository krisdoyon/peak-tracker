import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useLocation } from "react-router-dom";
import { clearMap } from "features/mapSlice";

export const useClearMap = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { listId } = useAppSelector((state) => state.newEntry);

  useEffect(() => {
    if (pathname.includes("/new-entry") && listId) return;
    if (!pathname.includes("/peak-lists/") && !pathname.includes("/log/"))
      dispatch(clearMap());
  }, [pathname]);
};
