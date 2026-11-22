
import kagglehub
import pandas as pd
import joblib

from kagglehub import KaggleDatasetAdapter

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_score
)

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    roc_auc_score
)

# 1. Load dataset
df = kagglehub.dataset_load(
    KaggleDatasetAdapter.PANDAS,
    "manishkc06/startup-success-prediction",
    "startup data.csv"
)

# 2. Target
y = (df["status"] == "acquired").astype(int)

# 3. Features
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

categorical_features = [
    "category_code",
    "state_code"
]

X = df[numeric_features + categorical_features].copy()

# 4. Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 5. Preprocessing
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, numeric_features),
    ("cat", categorical_pipeline, categorical_features)
])

# 6. Models
models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=8,
        min_samples_leaf=3,
        class_weight="balanced",
        random_state=42
    ),

    "Logistic Regression": LogisticRegression(
        max_iter=2000,
        class_weight="balanced"
    )
}

# 7. Cross-validation on training data only
cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

results = {}

for name, classifier in models.items():

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])

    scores = cross_val_score(
        pipeline,
        X_train,
        y_train,
        cv=cv,
        scoring="roc_auc"
    )

    results[name] = scores.mean()

    print(f"\n{name}")
    print("CV ROC-AUC scores:", scores.round(4))
    print("Mean CV ROC-AUC:", round(scores.mean(), 4))
    print("CV standard deviation:", round(scores.std(), 4))

# 8. Select model using CV results
best_name = max(results, key=results.get)

print("\nSelected model:", best_name)

best_model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", models[best_name])
])

# 9. Train on complete training set
best_model.fit(X_train, y_train)

# 10. Final test evaluation
predictions = best_model.predict(X_test)
probabilities = best_model.predict_proba(X_test)[:, 1]

print("\n========== FINAL TEST RESULTS ==========")
print("Accuracy:", round(accuracy_score(y_test, predictions), 4))
print("ROC-AUC:", round(roc_auc_score(y_test, probabilities), 4))

print("\nClassification Report:")
print(classification_report(y_test, predictions))

# 11. Save model
joblib.dump(
    best_model,
    "data/startup_success_model.pkl"
)

print("\nModel saved successfully!")
