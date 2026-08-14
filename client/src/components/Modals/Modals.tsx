import { useAppSelector } from "hooks/reduxHooks";
import { DialogUnsavedChanges } from "components/Dialogs/DialogUnsavedChanges/DialogUnsavedChanges";
import { ModalType } from "features/modalSlice";
import { WelcomeModal } from "components/Modals/WelcomeModal/WelcomeModal";
import { LoginModal } from "components/Modals/LoginModal/LoginModal";

const Modals = () => {
  const { openModal } = useAppSelector((state) => state.modal);
  return (
    <>
      {openModal === ModalType.UNSAVED_CHANGES && <DialogUnsavedChanges />}
      {openModal === ModalType.WELCOME && <WelcomeModal />}
      {openModal === ModalType.LOGIN && <LoginModal />}
    </>
  );
};

export default Modals;
