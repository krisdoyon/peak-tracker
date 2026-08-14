import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { resetForm } from "features/newEntrySlice";

export const useAppNavigate = () => {
  const { hasUnsavedChanges } = useAppSelector((state) => state.newEntry);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const appNavigate = (pageId: string) => {
    let shouldContinue = true;
    // let navigationSuccess = false;
    if (hasUnsavedChanges) {
      shouldContinue = confirm(
        "You have unsaved changes that will be discarded by this action. Continue?"
      );
    }
    if (shouldContinue) {
      navigate(pageId);
      dispatch(resetForm());
      // navigationSuccess = true;
    }
    // return navigationSuccess;
  };

  return appNavigate;
};
