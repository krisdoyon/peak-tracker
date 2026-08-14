import ujson
import firebase_admin
from firebase_admin import credentials, db
import os
from dotenv import load_dotenv

load_dotenv()

FIREBASE_CRED_PATH = os.getenv("FIREBASE_CRED_PATH")
FIREBASE_DB_URL = os.getenv("FIREBASE_DB_URL")

peak_path = "./data/json/peaks.json"
list_path = "./data/json/lists.json"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return ujson.load(f)


def init_firebase():
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred, {"databaseURL": FIREBASE_DB_URL})


def upload_peaks(peaks_data):
    # peaks_by_id = {peak["id"]: peak for peak in peaks_data}
    db.reference("test_peaks").set(peaks_data)
    print(f"Uploaded {len(peaks_data)} peaks to Firebase")


def upload_lists(lists_data):
    # lists_by_id = {lst["list_id"]: lst for lst in lists_data}
    db.reference("test_lists").set(lists_data)
    print(f"Uploaded {len(lists_data)} lists to Firebase")


def main():
    peaks_data = load_json(peak_path)
    lists_data = load_json(list_path)

    init_firebase()

    upload_peaks(peaks_data)
    upload_lists(lists_data)


main()
