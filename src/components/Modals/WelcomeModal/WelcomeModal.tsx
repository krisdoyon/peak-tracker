import styles from "./WelcomeModal.module.scss";
import { Modal } from "components/Modals/Modal";
import features from "./features.json";
import { ModalFeature } from "./ModalFeature";
import logoIcon from "assets/img/logo-icon.png";
import { Button, IconButton } from "components/Buttons";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { ModalType, openModal } from "features/modalSlice";

export const WelcomeModal = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLoginClick = () => {
    dispatch(openModal(ModalType.LOGIN));
  };

  return (
    <Modal className={styles.modal}>
      <header className={styles.header}>
        <img
          className={styles["logo-icon"]}
          src={logoIcon}
          alt="Peak Tracker logo icon"
        />
        <h1 className={styles.heading}>
          <span>Welcome to Peak Tracker!</span>
        </h1>
        <div className={styles["sub-heading-wrapper"]}>
          <h2 className={styles["sub-heading"]}>
            An app to track progress of mountain summit peakbagging lists
          </h2>
          <IconButton
            small={true}
            icon="question"
            className={styles["btn-question"]}
            aria-label="Question button: hover for definition of peakbagging list"
          />
          <div className={styles["question-bubble"]}>
            A "peakbagging list" is a list of mountain summits that all meet a
            certain criteria. For example, the New Hampshire 4,000 footers list
            contains 48 peaks with an elevation over 4,000 feet.
          </div>
        </div>
      </header>
      <div className={styles["features-grid"]}>
        {features.map((feature, i) => (
          <ModalFeature key={i} {...feature} />
        ))}
      </div>
      <ul className={styles.list}>
        {!isLoggedIn && (
          <>
            <li className={styles["list-item"]}>
              <span>
                To get started, log in or create an account using the button
                below:
              </span>
            </li>
            <Button className={styles["btn-login"]} onClick={handleLoginClick}>
              Login
            </Button>
          </>
        )}
        <li className={styles["list-item"]}>
          To read more about project architecture and view the code base you can{" "}
          <a
            className={styles["btn-inline"]}
            href="https://github.com/krisdoyon/peak-tracker"
            target="_blank"
          >
            view the GitHub repo.
          </a>
        </li>
        <li className={styles["list-item"]}>
          To see my other projects and learn more about me you can{" "}
          <a
            className={styles["btn-inline"]}
            href="https://krisdoyon.com"
            target="_blank"
          >
            visit my personal site.
          </a>
        </li>
      </ul>
    </Modal>
  );
};
