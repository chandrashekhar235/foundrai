import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib


# Load dataset
df = pd.read_csv("data/startup_dataset.csv")

# Combine startup information
df["text"] = (
    df["industry"].fillna("") + " " +
    df["target_customer"].fillna("") + " " +
    df["problem"].fillna("") + " " +
    df["solution"].fillna("") + " " +
    df["business_model"].fillna("")
)

# Input and target
X = df["text"]
y = df["market_type"]


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Create ML pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=5000,
        stop_words="english"
    )),
    ("classifier", LogisticRegression())
])


# Train
model.fit(X_train, y_train)


# Evaluate
predictions = model.predict(X_test)

print(classification_report(y_test, predictions))


# Save model
joblib.dump(
    model,
    "models/startup_classifier.pkl"
)

print("Model saved successfully.")