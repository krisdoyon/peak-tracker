import { renderHookWithStore } from "tests/testUtils";
import { usePeak } from "hooks/usePeak";
import * as apiSlice from "features/apiSlice";
import { beforeEach, describe, it, expect, vi, Mock } from "vitest";

vi.mock(import("features/apiSlice"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGetPeaksQuery: vi.fn(),
    useGetLogEntriesQuery: vi.fn(),
  };
});

describe("usePeak", () => {
  let initialState: any;

  beforeEach(() => {
    initialState = {
      auth: {
        userId: "user123",
        token: "token123",
        isLoggedIn: true,
      },
    };
    vi.clearAllMocks();
  });

  it("should return the peak data, completion status, and completed date", async () => {
    (apiSlice.useGetPeaksQuery as Mock).mockReturnValue({
      data: { id: 1, name: "Peak 1" },
      isLoading: false,
      isError: false,
    });

    (apiSlice.useGetLogEntriesQuery as Mock).mockReturnValue({
      data: [
        { peakIds: [1], date: "2024-10-01" },
        { peakIds: [2], date: "2024-09-30" },
      ],
    });

    const { result } = renderHookWithStore(() => usePeak(1), initialState);

    expect(result.current.peak.id).toEqual(1);
    expect(result.current.peak.name).toEqual("Peak 1");
    expect(result.current.isCompleted).toBe(true);
    expect(result.current.completedDate).toEqual("10/01/2024");
  });

  // it("should return undefined peak if not found", async () => {
  //   (apiSlice.useGetPeaksQuery as Mock).mockReturnValue({
  //     data: { id: 2, name: "Peak 2" },
  //     isLoading: false,
  //     isError: false,
  //   });

  //   const { result } = renderHookWithStore(() => usePeak(1), initialState);

  //   expect(result.current.peak).toBeUndefined();
  //   expect(result.current.isCompleted).toBe(false);
  //   expect(result.current.completedDate).toBeUndefined();
  // });

  // it("should skip log entries query if user is not logged in", async () => {
  //   initialState.auth.isLoggedIn = false;

  //   const { result } = renderHookWithStore(() => usePeak(1));

  //   expect(result.current.isCompleted).toBe(false);
  //   expect(result.current.completedDate).toBeUndefined();
  //   expect(result.current.peak).toBeUndefined(); // Expect peak to still be fetched
  // });
});
