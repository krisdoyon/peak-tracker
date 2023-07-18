export enum NavLinksEnum {
  MAP,
  PEAK_LISTS,
  LOG,
  STATS,
  NEW_ENTRY,
}

export const navLinks = [
  {
    to: "/",
    text: "Map",
    icon: "earth",
    active: NavLinksEnum.MAP,
  },
  {
    to: "/peak-lists",
    text: "Peak Lists",
    icon: "mountain",
    active: NavLinksEnum.PEAK_LISTS,
  },
  {
    to: "/log",
    text: "Trip Log",
    icon: "book",
    active: NavLinksEnum.LOG,
  },
  {
    to: "/stats",
    text: "Stats",
    icon: "chart",
    active: NavLinksEnum.STATS,
  },
  {
    to: "/new-entry",
    text: "New Entry",
    icon: "pencil",
    active: NavLinksEnum.NEW_ENTRY,
  },
];
