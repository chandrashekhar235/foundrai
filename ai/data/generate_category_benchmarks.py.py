
import kagglehub
import json
import pandas as pd

from kagglehub import KaggleDatasetAdapter

# Load Kaggle dataset
df = kagglehub.dataset_load(
    KaggleDatasetAdapter.PANDAS,
    "manishkc06/startup-success-prediction",
    "startup data.csv"
)

# Remove records without an industry category
df = df.dropna(subset=["category_code"])

# Generate category-level benchmarks
benchmarks = {}

for category, group in df.groupby("category_code"):

    total = len(group)

    acquired = (group["status"] == "acquired").sum()
    closed = (group["status"] == "closed").sum()

    benchmarks[category] = {
        "sample_size": int(total),

        "acquired_count": int(acquired),
        "closed_count": int(closed),

        "historical_acquisition_rate": round(
            acquired / total, 4
        ),

        "historical_closure_rate": round(
            closed / total, 4
        ),

        "median_funding_usd": round(
            float(group["funding_total_usd"].median()), 2
        ),

        "median_relationships": round(
            float(group["relationships"].median()), 2
        ),

        "median_milestones": round(
            float(group["milestones"].median()), 2
        )
    }

# Include an overall dataset benchmark
total = len(df)
acquired = (df["status"] == "acquired").sum()

output = {
    "dataset": "Kaggle Startup Success Prediction",
    "total_startups": int(total),

    "overall_historical_acquisition_rate": round(
        acquired / total, 4
    ),

    "categories": benchmarks
}

# Save JSON
with open(
    "data/startup_category_benchmarks.json",
    "w"
) as file:
    json.dump(output, file, indent=4)

print("Benchmarks generated successfully!")
print("Total categories:", len(benchmarks))
print("Total startups:", total)
print("\nSample categories:")

for category, stats in list(benchmarks.items())[:5]:
    print(category, stats)
