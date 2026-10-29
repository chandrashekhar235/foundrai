
import json
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "data" / "Listofstartups.csv"
OUTPUT_PATH = BASE_DIR / "data" / "startup_knowledge.json"

df = pd.read_csv(CSV_PATH, encoding="ISO-8859-1")
df.columns = df.columns.str.strip()

required_columns = [
    "Incubation Center",
    "Name of the startup",
    "Location of company",
    "Sector",
    "Company profile",
]

missing = set(required_columns) - set(df.columns)
if missing:
    raise ValueError(f"Missing CSV columns: {sorted(missing)}")

df = df[required_columns].fillna("")

records = []

for _, row in df.iterrows():
    name = str(row["Name of the startup"]).strip()
    profile = str(row["Company profile"]).strip()

    if not name or profile.lower() in {
        "", "nan", "not available yet"
    }:
        continue

    sector = str(row["Sector"]).strip()
    location = str(row["Location of company"]).strip()
    incubator = str(row["Incubation Center"]).strip()

    records.append({
        "type": "startup",
        "name": name,
        "incubation_center": incubator,
        "location": location,
        "sector": sector,
        "profile": profile,
        "text": (
            f"Startup: {name}. "
            f"Sector: {sector}. "
            f"Location: {location}. "
            f"Incubation center: {incubator}. "
            f"Company profile: {profile}"
        ),
    })

OUTPUT_PATH.write_text(
    json.dumps(records, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(f"Input rows: {len(df)}")
print(f"Useful startup records: {len(records)}")
print(f"Saved to: {OUTPUT_PATH}")
