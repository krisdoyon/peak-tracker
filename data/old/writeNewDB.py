import csv
import urllib.request

sheet_id = "1oGFk-J9TJ9va_ZbPvhd_s7tyXknLsavcesLl9_VSKRo"
peak_gid = "378873178"
list_gid = "867314001"


def get_sheet(gid: str):
    url = (
        f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"
    )

    with urllib.request.urlopen(url) as response:
        content = response.read().decode("utf-8")

        reader = csv.DictReader(content.splitlines())
        rows = list(reader)  # list of dicts, keyed by header row
        return rows


def getPeaks():
    return get_sheet(peak_gid)


def build_lists():
    peaks = get_sheet(peak_gid)
    lists = get_sheet(list_gid)

    peak_to_lists = {}

    for peak_list in lists:
        peak_ids = list(peak_list.get("peaks").split(","))
        for peak_id in peak_ids:
            peak_to_lists.setdefault(peak_id.strip(), []).append(peak_list["listId"])

    for peak in peaks:
        peak_id = peak.get("id")
        peak["list_ids"] = peak_to_lists[peak_id]

    return peaks


def write_peaks(path="peaks_with_lists.csv"):
    peaks = build_lists()

    for peak in peaks:
        peak["list_ids"] = ",".join(peak["list_ids"])

    fieldnames = list(peaks[0].keys())

    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(peaks)

    print(f"Wrote {len(peaks)} peaks to {path}")


write_peaks()
