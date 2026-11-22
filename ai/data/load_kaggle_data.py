
import kagglehub
from kagglehub import KaggleDatasetAdapter

df = kagglehub.dataset_load(
    KaggleDatasetAdapter.PANDAS,
    "manishkc06/startup-success-prediction",
    "startup data.csv"
)

print("Dataset shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 records:")
print(df.head().to_string())

print("\nMissing values:")
print(df.isnull().sum())

print("\nData types:")
print(df.dtypes)
