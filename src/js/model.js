import { peakListsArr, peakMap, elevationMap } from "./data/peakLists.js";
import { LogEntry } from "./logEntry.js";
import { User } from "./user.js";

export const currentUser = new User("Kris Doyon", "kristopher.doyon");

export const state = {
  
}

export const getPeakList = function (listID) {
  return peakListsArr.find((list) => list.id === listID);
};

export const getPeakListsArr = function (type = "all") {
  if (type === "all") {
    return peakListsArr;
  }
};

export const sortPeakList = function (listID, sortType) {
  const list = getPeakList(listID);
  if (sortType === "elevation") {
    list.data.sort((a, b) => b.elevFeet - a.elevFeet);
  }
  if (sortType === "alphabetical") {
    list.data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }
};

export const getCoords = async function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getDate = function (date) {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const now = new Date();
  if (date === "today")
    return new Intl.DateTimeFormat("en-CA", options).format(now);
  if (date === "yesterday")
    return new Intl.DateTimeFormat("en-CA", options).format(
      new Date(now.getTime() - 86400000)
    );
};

export const getCheckboxDisplayArr = function (listID) {
  sortPeakList(listID, "alphabetical");
  const listArr = getPeakList(listID).data;
  const firstHalf = listArr.slice(0, Math.ceil(listArr.length / 2));
  const secondHalf = listArr.slice(Math.ceil(listArr.length / 2));
  const displayArr = [];
  for (const [i, _] of listArr.entries()) {
    firstHalf[i] && displayArr.push(firstHalf[i]);
    secondHalf[i] && displayArr.push(secondHalf[i]);
  }
  return displayArr;
};