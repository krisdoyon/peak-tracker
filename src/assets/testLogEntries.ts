import { ILogEntry } from "models/interfaces";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

export const testLogEntries: ILogEntry[] = [
  {
    peakIds: [871851, 872093, 872313, 872495],
    stats: {
      elevation: 2000,
      distance: 9,
      minutes: 20,
      hours: 7,
    },
    notes:
      "Second day of the presidential traverse. Day started off cloudy but cleared up about half way through.",
    rating: 4,
    logId: "0",
    date: "2022-08-29",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [871380, 872101, 872247, 871352],
    stats: {
      elevation: 5000,
      distance: 12,
      minutes: "",
      hours: 8,
    },
    notes:
      "First day of the presidential traverse, stayed the night at Lake of the Clouds Hut. Incredible views!",
    rating: 5,
    logId: "1",
    date: "2022-08-28",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [973340, 973355, 971754],
    stats: {
      elevation: 4400,
      distance: 10.8,
      minutes: 30,
      hours: 8,
    },
    notes: "Awesome first trip to the Adirondacks!",
    rating: 5,
    logId: "2",
    date: "2021-08-15",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [872460, 872833, 872294, 872920],
    stats: {
      elevation: 4600,
      distance: 18,
      minutes: 30,
      hours: 12,
    },
    notes:
      "Completed the Kate Sleeper loop, stayed overnight at Camp Rich off the summit of Mt. Passaconaway.",
    rating: 4,
    logId: "3",
    date: "2021-06-25",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [871418, 872947],
    stats: {
      elevation: 1800,
      distance: 5.5,
      minutes: 10,
      hours: 4,
    },
    notes:
      "Great views of the fall foliage from both summits. Got some great photos of Crawford Notch from Mt. Willard and of the southern Presidential Range from Mt. Avalon!",
    rating: 5,
    logId: "4",
    date: "2020-10-11",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [607428],
    stats: {
      elevation: 1100,
      distance: 5,
      minutes: 30,
      hours: 4,
    },
    notes:
      "Finally made it to the Connecticut state high point. Hit Brace Mountain and Round Mountain on the loop as well!",
    rating: 4,
    logId: "5",
    date: "2020-08-10",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [7, 871556, 1],
    stats: {
      elevation: 3800,
      distance: 18,
      minutes: 15,
      hours: 13,
    },
    notes:
      "First backpacking trip in the White Mountains, saw an incredible sunset from West Bond!",
    rating: 5,
    logId: "6",
    date: "2020-07-16",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [872150, 872176],
    stats: {
      elevation: 3800,
      distance: 8.1,
      minutes: 15,
      hours: 6,
    },
    notes:
      "Hiked the Franconia Ridge Loop up Falling Waters Trail and down the Old Bridle Path. Chilly on the summits, saw a black bear on the way up!",
    rating: 5,
    logId: "7",
    date: "2019-05-12",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [180381],
    stats: {
      elevation: 4500,
      distance: 9.5,
      minutes: 20,
      hours: 7,
    },
    notes:
      "Difficult hike but well worth it. Cold at the top but 360 degree views from the summit!",
    rating: 5,
    logId: "8",
    date: "2018-09-04",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [181827, 181829],
    stats: {
      elevation: 3600,
      distance: 8.1,
      minutes: "",
      hours: 14,
    },
    notes: "First winter 14er trip!",
    rating: 5,
    logId: "9",
    date: "2018-01-01",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [204979],
    stats: {
      elevation: 5000,
      distance: 15,
      minutes: "",
      hours: 12,
    },
    notes: "Epic day, the keyhole route was intense!",
    rating: 5,
    logId: "10",
    date: "2017-07-24",
    tripType: TripType.COMPLETED,
  },
  {
    peakIds: [179961, 204685, 179956],
    stats: {
      elevation: 3100,
      distance: 7,
      minutes: 45,
      hours: 5,
    },
    notes: "Had a great day, warm weather and saw lots of mountain goats!",
    rating: 4,
    logId: "11",
    date: "2016-06-06",
    tripType: TripType.COMPLETED,
  },
];
