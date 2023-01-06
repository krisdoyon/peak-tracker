import styles from "./FilterSelects.module.scss";

interface Props {
  card: "stats" | "log";
}

export const FilterSelects = ({ card }: Props) => {
  return (
    <>
      <label htmlFor={`select-list-${card}`}>Filter by list:</label>
      <select className={styles["select-list"]} id={`select-list-${card}`}>
        <option value="all" selected>
          All lists
        </option>
      </select>
      <label htmlFor={`select-month-${card}`}>Filter by date:</label>
      <select id={`select-month-${card}`}>
        <option value="all" selected>
          All Months
        </option>
      </select>
      <select id={`select-year-${card}`}>
        <option value="all" selected>
          All years
        </option>
      </select>
    </>
  );
};
