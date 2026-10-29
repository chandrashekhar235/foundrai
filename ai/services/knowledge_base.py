
import json
from pathlib import Path

import pandas as pd

import re
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
STARTUP_KNOWLEDGE_PATH = DATA_DIR / "startup_knowledge.json"


class KnowledgeBase:
    def __init__(self):
        # Load original and expanded datasets together.
        self.market_data = self._load_combined_csv(
            "market_data.csv",
            "market_data_expanded.csv",
        )

        self.competitor_data = self._load_combined_csv(
            "competitor_data.csv",
            "competitor_data_expanded.csv",
        )

        self.business_models = self._load_combined_csv(
            "business_models.csv",
            "business_models_expanded.csv",
        )

        # Load processed Indian startup profiles.
        self.startup_knowledge = []

        if STARTUP_KNOWLEDGE_PATH.exists():
            with STARTUP_KNOWLEDGE_PATH.open(
                "r", encoding="utf-8"
            ) as file:
                self.startup_knowledge = json.load(file)

        # Load additional planning datasets.
        self.customer_personas = self._load_optional_csv(
            "customer_personas_synthetic.csv"
        )

        self.financial_assumptions = self._load_optional_csv(
            "financial_forecast_assumptions.csv"
        )

        self.mvp_roadmap_templates = self._load_optional_csv(
            "mvp_roadmap_templates.csv"
        )

        self.launch_strategy_templates = self._load_optional_csv(
            "launch_strategy_templates.csv"
        )

    @staticmethod
    def _load_combined_csv(original_name, expanded_name):
        """Combine original and expanded CSV files without overwriting them."""
        frames = []

        for filename in (original_name, expanded_name):
            path = DATA_DIR / filename

            if path.exists():
                frames.append(pd.read_csv(path))

        if not frames:
            raise FileNotFoundError(
                f"Neither {original_name} nor {expanded_name} exists."
            )

        return pd.concat(
            frames,
            ignore_index=True,
            sort=False,
        )

    @staticmethod
    def _load_optional_csv(filename):
        """Load an optional CSV, returning an empty DataFrame if absent."""
        path = DATA_DIR / filename

        if not path.exists():
            return pd.DataFrame()

        return pd.read_csv(path)

    # --------------------------------------------------
    # Existing public methods
    # --------------------------------------------------

    def get_market_information(self, industry):
        results = self.market_data[
            self.market_data["industry"].astype(str).str.lower()
            == industry.lower()
        ]

        return results.to_dict(orient="records")

    def get_competitors(self, industry):
        results = self.competitor_data[
            self.competitor_data["industry"].astype(str).str.lower()
            == industry.lower()
        ]

        return results.to_dict(orient="records")


    def get_business_models(self, business_model):
        """Match one or more business models from the user's input."""
        if self.business_models.empty:
            return []

        if "business_model" not in self.business_models.columns:
            return []

        def normalize(value):
            return re.sub(
                r"[^a-z0-9]+",
                " ",
                str(value or "").lower(),
            ).strip()

        query = normalize(business_model)
        if not query:
            return []

        labels = self.business_models["business_model"].fillna("").astype(str)
        normalized_labels = labels.map(normalize)

        # Prefer an exact match.
        exact = self.business_models[normalized_labels == query]
        if not exact.empty:
            return exact.to_dict(orient="records")

        # Otherwise match separate models mentioned in the input.
        query_terms = set(query.split()) - {"and", "or", "the", "model"}

        if not query_terms:
            return []

        matching_rows = []

        for index, label in normalized_labels.items():
            label_terms = set(label.split()) - {"and", "or", "the", "model"}

            if label_terms and label_terms.issubset(query_terms):
                matching_rows.append(index)

        return self.business_models.loc[matching_rows].to_dict(
            orient="records"
        )


    def get_all_knowledge(self):
        knowledge = []

        # Market knowledge.
        for _, row in self.market_data.iterrows():
            knowledge.append({
                "type": "market",
                "text": (
                    f"{row.get('industry', '')} "
                    f"({row.get('market_type', '')}) — "
                    f"{row.get('description', '')}. "
                    f"Target customers: "
                    f"{row.get('target_customers', '')}. "
                    f"Common problems: "
                    f"{row.get('common_problems', '')}. "
                    f"Common business models: "
                    f"{row.get('common_business_models', '')}."
                ),
            })

        # Competitor knowledge.
        for _, row in self.competitor_data.iterrows():
            knowledge.append({
                "type": "competitor",
                "text": (
                    f"{row.get('category', '')} "
                    f"({row.get('industry', '')} industry) — "
                    f"{row.get('competitor_type', '')}. "
                    f"{row.get('description', '')}. "
                    f"Strength: {row.get('common_strength', '')}. "
                    f"Weakness: {row.get('common_weakness', '')}."
                ),
            })

        # Business model knowledge.
        for _, row in self.business_models.iterrows():
            knowledge.append({
                "type": "business_model",
                "text": (
                    f"Business model: "
                    f"{row.get('business_model', '')} — "
                    f"{row.get('description', '')}. "
                    f"Common in: {row.get('common_industries', '')}. "
                    f"Advantages: {row.get('advantages', '')}. "
                    f"Challenges: {row.get('challenges', '')}."
                ),
            })

        # Indian startup examples.
        for startup in self.startup_knowledge:
            knowledge.append({
                "type": "startup",
                "text": startup.get("text", ""),
                "name": startup.get("name", ""),
                "sector": startup.get("sector", ""),
                "location": startup.get("location", ""),
                "incubation_center": startup.get(
                    "incubation_center", ""
                ),
                "profile": startup.get("profile", ""),
            })

        # Customer persona hypotheses.
        for _, row in self.customer_personas.iterrows():
            knowledge.append({
                "type": "customer_persona",
                "text": self._row_to_text(row),
            })

        # MVP roadmap templates.
        for _, row in self.mvp_roadmap_templates.iterrows():
            knowledge.append({
                "type": "mvp_roadmap",
                "text": self._row_to_text(row),
            })

        # Launch strategy templates.
        for _, row in self.launch_strategy_templates.iterrows():
            knowledge.append({
                "type": "launch_strategy",
                "text": self._row_to_text(row),
            })

        return [
            item
            for item in knowledge
            if item.get("text", "").strip()
        ]

    @staticmethod
    def _row_to_text(row):
        """Convert a DataFrame row into readable retrieval text."""
        parts = []

        for column, value in row.items():
            if pd.notna(value) and str(value).strip():
                parts.append(f"{column}: {value}")

        return " | ".join(parts)

    @staticmethod
    def _split_csv_field(value):
        """Split a comma-separated field into a clean list."""
        if pd.isna(value) or not str(value).strip():
            return []

        return [
            item.strip()
            for item in str(value).split(",")
            if item.strip()
        ]

    def get_market_summary(self, industry):
        rows = self.get_market_information(industry)

        if not rows:
            return None

        row = rows[0]

        return {
            "industry": row.get("industry", industry),
            "market_type": row.get("market_type", ""),
            "description": row.get("description", ""),
            "target_customers": self._split_csv_field(
                row.get("target_customers", "")
            ),
            "common_problems": self._split_csv_field(
                row.get("common_problems", "")
            ),
            "common_business_models": self._split_csv_field(
                row.get("common_business_models", "")
            ),
        }

    def get_competitor_summary(self, industry):
        rows = self.get_competitors(industry)

        return [
            {
                "category": row.get("category", ""),
                "competitor_type": row.get("competitor_type", ""),
                "description": row.get("description", ""),
                "common_strength": row.get("common_strength", ""),
                "common_weakness": row.get("common_weakness", ""),
            }
            for row in rows
        ]


    def get_business_model_summary(self, business_model):
        """Combine matching business-model records into one summary."""
        rows = self.get_business_models(business_model)

        if not rows:
            return None

        def clean(value):
            if pd.isna(value):
                return ""
            return str(value).strip()

        def unique_csv_values(key):
            values = []

            for row in rows:
                values.extend(self._split_csv_field(row.get(key, "")))

            return list(dict.fromkeys(values))

        descriptions = list(dict.fromkeys(
            clean(row.get("description", ""))
            for row in rows
            if clean(row.get("description", ""))
        ))

        return {
            "business_model": business_model,
            "matched_models": list(dict.fromkeys(
                clean(row.get("business_model", ""))
                for row in rows
                if clean(row.get("business_model", ""))
            )),
            "description": " ".join(descriptions),
            "common_industries": unique_csv_values("common_industries"),
            "advantages": unique_csv_values("advantages"),
            "challenges": unique_csv_values("challenges"),
        }


    def get_all_market_summaries(self):
        summaries = []

        for _, row in self.market_data.iterrows():
            summary = self.get_market_summary(
                str(row.get("industry", ""))
            )

            if summary:
                summaries.append(summary)

        return summaries

    def get_startups(self, sector=None, location=None, limit=10):
        """Return startup records filtered by sector and/or location."""
        results = self.startup_knowledge

        if sector:
            results = [
                item
                for item in results
                if sector.lower() in item.get("sector", "").lower()
            ]

        if location:
            results = [
                item
                for item in results
                if location.lower() in item.get("location", "").lower()
            ]

        return results[:limit]

    def get_customer_personas(self, limit=10):
        """Return illustrative customer persona records."""
        if self.customer_personas.empty:
            return []

        return self.customer_personas.head(limit).to_dict(
            orient="records"
        )

    def get_financial_assumptions(self, industry=None, limit=10):
        """Return illustrative financial assumptions, not verified forecasts."""
        results = self.financial_assumptions

        if industry and not results.empty:
            matching_columns = [
                column
                for column in results.columns
                if column.lower() in ("industry", "sector")
            ]

            if matching_columns:
                column = matching_columns[0]
                results = results[
                    results[column]
                    .astype(str)
                    .str.contains(industry, case=False, na=False)
                ]

        return results.head(limit).to_dict(orient="records")

    def get_mvp_roadmap_templates(self, limit=10):
        """Return MVP roadmap planning templates."""
        return self.mvp_roadmap_templates.head(limit).to_dict(
            orient="records"
        )

    def get_launch_strategy_templates(self, limit=10):
        """Return launch strategy planning templates."""
        return self.launch_strategy_templates.head(limit).to_dict(
            orient="records"
        )
