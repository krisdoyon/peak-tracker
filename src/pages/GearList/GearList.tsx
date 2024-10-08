// import { CardBody } from "components/Card";
// import styles from "./GearList.module.scss";
// import { v4 as uuidv4 } from "uuid";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { ColDef } from "ag-grid-community";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { Button, IconButton } from "components/Buttons";
// import {
//   useGetGearListQuery,
//   useUpdateGearListMutation,
// } from "features/apiSlice";
// import { useAppSelector } from "hooks/reduxHooks";
// import { Checkbox } from "@mui/material";

// interface DeleteButtonRendererProps {
//   data: GearListItem;
//   onClick: (id: string | null) => void;
// }

// interface CheckboxRendererProps {
//   data: GearListItem;
//   onClick: (id: string | null) => void;
// }

// const DeleteButtonRenderer = (props: DeleteButtonRendererProps) => {
//   const {
//     onClick,
//     data: { id, name, isNewItem },
//   } = props;

//   if (name === "Total") return null;

//   const handleClick = () => {
//     onClick(id);
//   };

//   return (
//     <IconButton icon={isNewItem ? "add" : "remove"} onClick={handleClick} />
//   );
// };

// const CheckboxRenderer = (props: CheckboxRendererProps) => {
//   const {
//     onClick,
//     data: { id, name, isNewItem, active },
//   } = props;
//   if (name === "Total" || isNewItem) return null;

//   const handleClick = () => {
//     onClick(id);
//   };

//   return <Checkbox checked={active} onClick={handleClick} />;
// };

// export type GearListItem = {
//   active: boolean;
//   name: string;
//   brand: string;
//   item: string;
//   weightOz: number;
//   id: string;
//   isNewItem?: boolean;
// };

// export const GearList = () => {
//   const [newItem, setNewItem] = useState<GearListItem | null>(null);

//   const [updateGearList] = useUpdateGearListMutation();

//   const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

//   // const gridRef = useRef<any>(null); // Add a ref to the grid

//   const [gearItems, setGearItems] = useState<GearListItem[]>([]);

//   const {
//     data: fetchedGearItems = [],
//     isLoading,
//     isError,
//     error,
//   } = useGetGearListQuery(
//     { userId, token },
//     { skip: userId === null || !isLoggedIn || token === null }
//   );

//   useEffect(() => {
//     setGearItems(fetchedGearItems);
//   }, [fetchedGearItems]);

//   const handleAddNewItem = () => {
//     const newItem = {
//       active: true,
//       id: uuidv4(),
//       name: "",
//       brand: "",
//       item: "",
//       weightOz: 0,
//       isNewItem: true,
//     };
//     setNewItem(newItem);
//   };

//   const handleIconButtonClick = (id: string) => {
//     let newGearItems;

//     if (id === newItem?.id) {
//       let newGearItem = { ...newItem };
//       delete newGearItem.isNewItem;
//       newGearItems = [...gearItems, newGearItem];
//       setNewItem(null);
//     } else {
//       newGearItems = gearItems.filter((item) => item.id !== id);
//     }
//     updateGearList({ userId, gearList: newGearItems, token });
//   };

//   const handleCheckboxClick = (id: string) => {
//     let newGearItems;

//     newGearItems = gearItems.map((item) => {
//       if (item.id === id) {
//         return {
//           ...item,
//           active: !item.active,
//         };
//       }
//       return item;
//     });
//     updateGearList({ userId, gearList: newGearItems, token });
//   };

//   const columnDefs: ColDef[] = [
//     {
//       headerName: "",
//       field: "include",
//       width: 50,
//       cellRenderer: CheckboxRenderer,
//       cellRendererParams: {
//         onClick: handleCheckboxClick,
//       },
//     },

//     {
//       headerName: "Name",
//       field: "name",
//       flex: 2,
//       editable: true,
//     },
//     {
//       headerName: "Brand",
//       field: "brand",
//       flex: 2,
//       editable: true,
//     },
//     {
//       headerName: "Item",
//       field: "item",
//       flex: 2,
//       editable: true,
//     },
//     {
//       headerName: "Weight (oz)",
//       field: "weightOz",
//       flex: 1,
//       editable: true,
//     },
//     {
//       headerName: "Weight (lb)",
//       field: "weightLb",
//       flex: 1,
//       editable: true,
//     },

//     {
//       headerName: "",
//       field: "action",
//       width: 50,
//       cellRenderer: DeleteButtonRenderer,
//       cellRendererParams: {
//         onClick: handleIconButtonClick,
//       },
//     },
//   ];

//   const rowData = useMemo(() => {
//     const items = gearItems.map((item) => ({
//       ...item,
//       weightLb: item.weightOz / 16,
//     }));

//     const totalOz = items.reduce((acc, cur) => {
//       if (cur.active) acc += cur.weightOz;
//       return acc;
//     }, 0);

//     const totalLb = totalOz / 16;

//     const totalRow = {
//       name: "Total",
//       weightOz: +totalOz.toFixed(2),
//       weightLb: +totalLb.toFixed(2),
//       editable: false,
//     };
//     return [...items, ...(newItem !== null ? [newItem] : []), totalRow];
//   }, [gearItems, newItem]);

//   const getRowStyle = (params: any) => {
//     if (params.data.editable === false) {
//       // return { fontWeight: "bold", pointerEvents: "none" };
//       return;
//     }
//     return;
//   };

//   const handleCellValueChanged = (event: any) => {
//     const { data, colDef, newValue } = event;
//     const { field } = colDef;

//     let updatedGearItems = [...gearItems];

//     const index = gearItems.findIndex((item) => item.id === data.id);

//     let item = updatedGearItems[index];

//     item = {
//       ...item,
//       [field]: newValue,
//     };

//     if (field === "weightLb") {
//       item.weightOz = newValue * 16;
//     }

//     const isNewItem = item.id === newItem?.id;

//     if (isNewItem) {
//       setNewItem(item);
//     } else {
//       updatedGearItems[index] = item;
//       updateGearList({ userId, gearList: updatedGearItems, token });
//     }
//   };

//   return (
//     <CardBody className={styles.body}>
//       <AgGridReact
//         className="ag-theme-alpine"
//         rowData={rowData}
//         columnDefs={columnDefs}
//         rowHeight={28}
//         onCellValueChanged={handleCellValueChanged}
//         // getRowStyle={getRowStyle}
//       ></AgGridReact>
//       <Button onClick={handleAddNewItem}>Add new item</Button>
//     </CardBody>
//   );
// };

///////

import { CardBody } from "components/Card";
import styles from "./GearList.module.scss";
import { v4 as uuidv4 } from "uuid";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Button, IconButton } from "components/Buttons";
import {
  useGetGearListQuery,
  useUpdateGearListMutation,
} from "features/apiSlice";
import { useAppSelector } from "hooks/reduxHooks";
import { Checkbox } from "@mui/material";
import { API_URL } from "assets/config";

interface DeleteButtonRendererProps {
  data: GearListItem;
  onClick: (id: string | null) => void;
}

interface CheckboxRendererProps {
  data: GearListItem;
  onClick: (id: string | null) => void;
}

const DeleteButtonRenderer = (props: DeleteButtonRendererProps) => {
  const {
    onClick,
    data: { id, name, isNewItem },
  } = props;
  if (name === "Total") return null;

  const handleClick = () => {
    onClick(id);
  };

  return (
    <IconButton icon={isNewItem ? "add" : "remove"} onClick={handleClick} />
  );
};

const CheckboxRenderer = (props: CheckboxRendererProps) => {
  const {
    onClick,
    data: { id, name, isNewItem, active },
  } = props;
  if (name === "Total" || isNewItem) return null;

  const handleClick = () => {
    onClick(id);
  };

  return <Checkbox checked={active} onClick={handleClick} />;
};

export type GearListItem = {
  active: boolean;
  name: string;
  brand: string;
  item: string;
  weightOz: number;
  id: string;
  isNewItem?: boolean;
};

export const GearList = () => {
  const [newItem, setNewItem] = useState<GearListItem | null>(null);
  const [gearItems, setGearItems] = useState<GearListItem[]>([]);
  const [updateGearList] = useUpdateGearListMutation();
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  // const { data: fetchedGearItems = [] } = useGetGearListQuery(
  //   { userId, token },
  //   { skip: userId === null || !isLoggedIn || token === null }
  // );

  useEffect(() => {
    fetchGearItems();
  }, []);

  const fetchGearItems = async () => {
    if (userId === null || !isLoggedIn || token === null) return;
    const response = await fetch(
      API_URL + `/users/${userId}/gearList.json?auth=${token}`
    );
    const data = await response.json();
    setGearItems(data);
  };

  const handleAddNewItem = () => {
    const newItem = {
      active: true,
      id: uuidv4(),
      name: "",
      brand: "",
      item: "",
      weightOz: 0,
      isNewItem: true,
    };
    setNewItem(newItem);
  };

  const handleIconButtonClick = useCallback(
    (id: string) => {
      let newGearItems;

      if (id === newItem?.id) {
        let newGearItem = { ...newItem };
        delete newGearItem.isNewItem;
        newGearItems = [...gearItems, newGearItem];
        setNewItem(null);
      } else {
        newGearItems = gearItems.filter((item) => item.id !== id);
      }

      setGearItems(newGearItems);
      // updateGearList({ userId, gearList: newGearItems, token });
    },
    [newItem, gearItems, updateGearList, userId, token]
  );

  const handleCheckboxClick = useCallback(
    (id: string) => {
      const newGearItems = gearItems.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      );

      setGearItems(newGearItems);
      // updateGearList({ userId, gearList: newGearItems, token });
    },
    [gearItems, updateGearList, userId, token]
  );

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "include",
      width: 50,
      cellRenderer: CheckboxRenderer,
      cellRendererParams: {
        onClick: handleCheckboxClick,
      },
    },
    {
      headerName: "Name",
      field: "name",
      flex: 2,
      editable: true,
    },
    {
      headerName: "Brand",
      field: "brand",
      flex: 2,
      editable: true,
    },
    {
      headerName: "Item",
      field: "item",
      flex: 2,
      editable: true,
    },
    {
      headerName: "Weight (oz)",
      field: "weightOz",
      flex: 1,
      editable: true,
    },
    {
      headerName: "Weight (lb)",
      field: "weightLb",
      flex: 1,
      editable: true,
    },
    {
      headerName: "",
      field: "action",
      width: 50,
      cellRenderer: DeleteButtonRenderer,
      cellRendererParams: {
        onClick: handleIconButtonClick,
      },
    },
  ];

  const rowData = useMemo(() => {
    const items = gearItems.map((item) => ({
      ...item,
      weightLb: item.weightOz / 16,
    }));

    const totalOz = items.reduce((acc, cur) => {
      if (cur.active) acc += cur.weightOz;
      return acc;
    }, 0);

    const totalLb = totalOz / 16;

    const totalRow = {
      name: "Total",
      weightOz: +totalOz.toFixed(2),
      weightLb: +totalLb.toFixed(2),
      editable: false,
    };
    return [...items, ...(newItem !== null ? [newItem] : []), totalRow];
  }, [gearItems, newItem]);

  const getRowStyle = (params: any) => {
    if (params.data.editable === false) {
      return { fontWeight: "bold" };
    }
    return;
  };

  const handleCellValueChanged = useCallback(
    (event: any) => {
      const { data, colDef, newValue } = event;
      const { field } = colDef;

      const updatedGearItems = [...gearItems];
      const index = updatedGearItems.findIndex((item) => item.id === data.id);

      let item = { ...updatedGearItems[index], [field]: newValue };

      if (field === "weightLb") {
        item.weightOz = newValue * 16;
      }

      const isNewItem = item.id === newItem?.id;

      if (isNewItem) {
        setNewItem(item);
      } else {
        updatedGearItems[index] = item;
        setGearItems(updatedGearItems);
        // updateGearList({ userId, gearList: updatedGearItems, token });
      }

      // Use refreshCells to only refresh the modified cell
      // if (gridRef.current) {
      //   gridRef.current.api.refreshCells({
      //     rowNodes: [event.node],
      //     force: true,
      //   });
      // }
    },
    [gearItems, newItem, updateGearList, userId, token]
  );

  const gridOptions = {
    getRowId: (data: any) => {
      return data.data.id;
    }, // Specify how rows are uniquely identified
  };

  return (
    <CardBody className={styles.body}>
      <AgGridReact
        // ref={gridRef} // Attach the ref to AgGridReact
        className="ag-theme-alpine"
        rowData={rowData}
        columnDefs={columnDefs}
        rowHeight={28}
        onCellValueChanged={handleCellValueChanged}
        getRowStyle={getRowStyle}
        gridOptions={gridOptions}
      />
      <Button onClick={handleAddNewItem}>Add new item</Button>
    </CardBody>
  );
};
