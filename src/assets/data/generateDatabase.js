// import fs from "fs";
import * as XLSX from "xlsx";
import * as fs from "fs";

const outputfilePath = "G:/My Drive/Documents/Peak Tracker/mountains.xlsx";

const inputPath = `${process.cwd()}/src/assets/data/json`;

const readPeakList = async (fileName) => {
  try {
    const path = `${inputPath}/${fileName}`;
    const data = await fs.promises.readFile(path, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(`Error reading peaks:`, err);
  }
};

async function writeDatabase() {
  const allPeaks = [];
  const allLists = [];
  const files = await fs.promises.readdir(inputPath);
  for (const file of files) {
    const peakList = await readPeakList(file);
    // Write the list
    const { title, listID, peaks, description } = peakList;
    allLists.push({
      title,
      listId: listID,
      description,
      peaks: JSON.stringify(peaks.map(({ id }) => id)),
    });

    // Write the peaks
    for (const peak of peaks) {
      if (!allPeaks.some((existPeak) => existPeak.id === peak.id))
        allPeaks.push(peak);
    }
  }

  const wb = XLSX.utils.book_new();
  const peaks_ws = XLSX.utils.json_to_sheet(allPeaks);
  const lists_ws = XLSX.utils.json_to_sheet(allLists);
  XLSX.utils.book_append_sheet(wb, peaks_ws, "Peaks");
  XLSX.utils.book_append_sheet(wb, lists_ws, "Lists");

  XLSX.writeFile(wb, outputfilePath);
}

writeDatabase();
