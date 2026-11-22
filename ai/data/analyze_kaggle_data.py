
import kagglehub
from kagglehub import KaggleDatasetAdapter

df = kagglehub.dataset_load(
    KaggleDatasetAdapter.PANDAS,
    "manishkc06/startup-success-prediction",
    "startup data.csv"
)

print("\n========== TARGET DISTRIBUTION ==========")
print(df["status"].value_counts())
print("\nTarget percentages:")
print(df["status"].value_counts(normalize=True) * 100)

print("\n========== LABEL DISTRIBUTION ==========")
print(df["labels"].value_counts())

print("\n========== LABEL VS STATUS ==========")
print(
    __import__("pandas").crosstab(
        df["labels"], df["status"]
    )
)

print("\n========== NUMERIC STATISTICS ==========")
print(df.describe().T)

print("\n========== DUPLICATE RECORDS ==========")
print(df.duplicated().sum())

print("\n========== INDUSTRY DISTRIBUTION ==========")
print(df["category_code"].value_counts())

print("\n========== FUNDING STATISTICS ==========")
print(df.groupby("status")["funding_total_usd"].describe())

print("\n========== SUCCESS BY INDUSTRY ==========")
print(
    df.groupby("category_code")["status"]
    .value_counts(normalize=True)
    .unstack(fill_value=0)
)
