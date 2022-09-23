"use strict";

// DATE

const options = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

const now = new Date();
const today = new Intl.DateTimeFormat("en-CA", options).format(now);
const yesterday = new Intl.DateTimeFormat("en-CA", options).format(
  new Date(now.getTime() - 86400000)
);
