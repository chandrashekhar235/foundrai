
import kagglehub
import joblib
import pandas as pd

from kagglehub import KaggleDatasetAdapter
from sklearn.model_selection import train_test_split
from sklearn.inspection import permutation_importance

# Load dataset
df = kagglehub.dataset_load(
    KaggleDatasetAdapter.PANDAS,
    "manishkc06/startup-success-prediction",
    "startup data.csv"
)

# Same features used during training
numeric_features = [
    "age_first_funding_year",
    "age_last_funding_year",
    "age_first_milestone_year",
    "age_last_milestone_year",
    "relationships",
    "funding_rounds",
    "funding_total_usd",
    "milestones",
    "avg_participants",
    "has_VC",
    "has_angel",
    "has_roundA",
    "has_roundB",
    "has_roundC",
    "has_roundD"
]

categorical_features = ["category_code", "state_code"]

X = df[numeric_features + categorical_features].copy()
y = (df["status"] == "acquired").astype(int)

# Recreate the exact same test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Load trained model
model = joblib.load("data/startup_success_model.pkl")

# Calculate permutation importance
result = permutation_importance(
    model,
    X_test,
    y_test,
    scoring="roc_auc",
    n_repeats=20,
    random_state=42,
    n_jobs=-1
)

# Display ranked features
importance_df = pd.DataFrame({
    "feature": X_test.columns,
    "importance_mean": result.importances_mean,
    "importance_std": result.importances_std
})

importance_df = importance_df.sort_values(
    by="importance_mean",
    ascending=False
)

print("\n========== FEATURE IMPORTANCE ==========")
print(importance_df.to_string(index=False))

print("\nAnalysis completed!")
