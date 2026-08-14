import urllib.request
import csv
import ujson

sheet_id = "1afe4_8lexmw3a-H95y9RIn4wflwQuWjL7PlW4nNSqRk"
peak_gid = "1422556425"
list_gid = "122185414"

peak_path = "./data/json/peaks.json"
list_path = "./data/json/lists.json"


def get_sheet(gid: str):
    url = (
        f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"
    )
    with urllib.request.urlopen(url) as response:
        content = response.read().decode("utf-8")

        reader = csv.DictReader(content.splitlines())
        rows = list(reader)  # list of dicts, keyed by header row
        return rows


peaks = get_sheet(peak_gid)
lists = get_sheet(list_gid)


def generate_list_db():
    peaks_by_list = {peak_list["listId"]: [] for peak_list in lists}

    for peak in peaks:
        list_ids = [
            list_id.strip()
            for list_id in (peak.get("list_ids") or "").split(",")
            if list_id.strip()
        ]
        for list_id in list_ids:
            if list_id not in peaks_by_list:
                print(
                    f"Warning: peak {peak.get('id')} references unknown list_id {list_id}"
                )
                continue
            peaks_by_list[list_id].append(int(peak["id"]))

    built_lists = [
        {
            "listId": lst["listId"],
            "title": lst["title"],
            "description": lst["description"],
            "peaks": peaks_by_list[lst["listId"]],
        }
        for lst in lists
    ]

    with open(list_path, "w", encoding="utf-8") as f:
        ujson.dump(built_lists, f, indent=2)

    print(f"Wrote {len(built_lists)} lists to {list_path}")


def generate_peak_db():
    cleaned = []
    for peak in peaks:
        item = {key: value for key, value in peak.items() if key != "list_ids"}

        item["id"] = int(item["id"])
        item["elevation"] = int(item["elevation"])
        item["lat"] = float(item["lat"])
        item["long"] = float(item["long"])

        cleaned.append(item)

    with open(peak_path, "w", encoding="utf-8") as f:
        ujson.dump(cleaned, f, indent=2)

    print(f"Wrote {len(cleaned)} peaks to {peak_path}")
    pass


def main():
    generate_peak_db()
    generate_list_db()


main()
