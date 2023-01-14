import { uniquePeaks } from "./createPeakLists";
import { IPeak } from "interfaces";



// export class LogEntry {
//   // peaks: IPeak[];
//   peaks;
//   notes;
//   stats;
//   rating;
//   // date!: {
//   //   fullDate: Date;
//   //   day: string;
//   //   month: {
//   //     numeric: string;
//   //     alpha: string;
//   //   };
//   //   year: string;
//   // };
//   // setStats?: () => void;

//   constructor(
//     formData: any,
//     public logID: number,
//     public lists: ILogEntryList[],
//     public timestamp: number
//   ) {
//     this.peaks = formData.peakIDs.map((peakID: number) =>
//       uniquePeaks.find((peak) => peak.id === peakID)
//     );
//     const stats = {
//       elevation: +formData.elevation || null,
//       distance: +formData.distance || null,
//       minutes: +formData.minutes || null,
//       hours: +formData.hours || null,
//       time:
//         this.stats.hours || this.stats.minutes
//           ? Math.round(
//               ((this.stats.hours || 0) + (this.stats.minutes || 0) / 60) * 10
//             ) / 10
//           : null,
//       avgSpeed:
//         this.stats.distance && this.stats.time
//           ? Math.round((this.stats.distance / this.stats.time) * 10) / 10
//           : null,
//       avgElevation:
//         this.stats.elevation && this.stats.distance
//           ? Math.round(this.stats.elevation / this.stats.distance)
//           : null,
//     };
//     this.stats = stats;
//     this.notes = formData.notes || undefined;
//     this.rating = +formData.rating || undefined;
//   }
// }
