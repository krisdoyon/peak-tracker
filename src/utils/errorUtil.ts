import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

// type appError = {
//   message: string;
//   status:
// };

export const transformApiError = (
  error: FetchBaseQueryError | SerializedError | undefined
) => {
  let errorMessage = "Something went wrong";
  if (error) {
    if ("status" in error) {
      if ("error" in error) {
        errorMessage = error.error;
      } else if ("data" in error) {
        const { data }: any = error;
        if ("error" in data) {
          if (typeof data.error === "string") errorMessage = data.error;
        }
      }
    } else {
      errorMessage = error.message || errorMessage;
    }
  }

  return errorMessage;
};
