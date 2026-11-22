import json
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import pandas as pd

try:
    from .financial_forecast import FinancialForecast
    from .knowledge_base import KnowledgeBase
    from .retriever import KnowledgeRetriever
    from .startup_plan import generate_startup_plan

except ImportError:
    from services.financial_forecast import FinancialForecast
    from services.knowledge_base import KnowledgeBase
    from services.retriever import KnowledgeRetriever
    from services.startup_plan import generate_startup_plan


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "startup_classifier.pkl"
SUCCESS_MODEL_PATH = BASE_DIR / "data" / "startup_success_model.pkl"
BENCHMARK_PATH = BASE_DIR / "data" / "startup_category_benchmarks.json"


class StartupAnalyzer:

    def __init__(self):

        # Load the trained ML model.
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Startup classifier not found: {MODEL_PATH}"
            )

        self.model = joblib.load(MODEL_PATH)

        # Load the Kaggle startup acquisition model.
        if not SUCCESS_MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Startup success model not found: {SUCCESS_MODEL_PATH}"
            )

        self.success_model = joblib.load(SUCCESS_MODEL_PATH)

        # Load historical industry benchmarks.
        if not BENCHMARK_PATH.exists():
            raise FileNotFoundError(
                f"Category benchmarks not found: {BENCHMARK_PATH}"
            )

        with open(BENCHMARK_PATH, "r", encoding="utf-8") as file:
            self.category_benchmarks = json.load(file)

        # Initialize knowledge base and retriever.
        self.knowledge_base = KnowledgeBase()
        self.retriever = KnowledgeRetriever()

        # Initialize financial forecasting service.
        self.financial_forecast = FinancialForecast()

    # --------------------------------------------------
    # Classification
    # --------------------------------------------------

    def _get_classification_confidence(
        self,
        text: str,
    ) -> tuple[Optional[str], Optional[float], Optional[str]]:
        """Return classification, confidence, and confidence label."""

        try:
            if hasattr(self.model, "predict_proba"):

                probas = self.model.predict_proba([text])[0]

                classes = getattr(
                    self.model,
                    "classes_",
                    ["B2B", "B2C"],
                )

                pred_idx = int(probas.argmax())
                classification = str(classes[pred_idx])
                confidence = float(probas[pred_idx])

                if confidence >= 0.75:
                    confidence_label = "High"

                elif confidence >= 0.60:
                    confidence_label = "Moderate"

                elif confidence >= 0.45:
                    confidence_label = "Low"

                else:
                    confidence_label = "Low (caution)"

                return (
                    classification,
                    confidence,
                    confidence_label,
                )

            classification = str(self.model.predict([text])[0])

            return classification, None, None

        except Exception:

            try:
                classification = str(self.model.predict([text])[0])
                return classification, None, None

            except Exception:
                return None, None, None

    # --------------------------------------------------
    # Historical acquisition / success prediction
    # --------------------------------------------------

    def _get_startup_success_analysis(
        self,
        startup: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Predict startup acquisition probability and compare against industry benchmarks."""

        try:
            raw_category = (
                startup.get("category_code")
                or startup.get("category")
                or startup.get("industry")
                or "other"
            )
            category = str(raw_category).lower().strip()

            categories_map = {
                str(k).lower(): v
                for k, v in self.category_benchmarks.get("categories", {}).items()
            }

            benchmarks = categories_map.get(
                category,
                categories_map.get("other", {}),
            )

            overall_rate = self.category_benchmarks.get(
                "overall_historical_acquisition_rate"
            )

            # Extract numeric inputs with safe fallbacks for early-stage submissions
            funding_total = float(
                startup.get("funding_total_usd")
                or startup.get("fundingTotal")
                or 0.0
            )
            funding_rounds = int(
                startup.get("funding_rounds")
                or startup.get("fundingRounds")
                or 0
            )
            relationships = int(
                startup.get("relationships")
                or 0
            )
            milestones = int(
                startup.get("milestones")
                or 0
            )

            row_data: Dict[str, Any] = {
                "funding_total_usd": funding_total,
                "funding_rounds": funding_rounds,
                "relationships": relationships,
                "milestones": milestones,
                "category_code": category,
            }

            # Align DataFrame columns dynamically with the trained model's expected features
            expected_cols = getattr(
                self.success_model,
                "feature_names_in_",
                None,
            )

            if expected_cols is not None:
                aligned_row = {}
                for col in expected_cols:
                    if col in row_data:
                        aligned_row[col] = row_data[col]
                    elif col in startup and startup[col] is not None:
                        aligned_row[col] = startup[col]
                    else:
                        aligned_row[col] = 0
                features = pd.DataFrame([aligned_row])[list(expected_cols)]
            else:
                features = pd.DataFrame([row_data])

            if hasattr(self.success_model, "predict_proba"):
                prob = float(self.success_model.predict_proba(features)[0][1])
            else:
                prob = float(self.success_model.predict(features)[0])

            if prob >= 0.70:
                outlook = "High Acquisition Potential"
            elif prob >= 0.45:
                outlook = "Moderate Acquisition Potential"
            else:
                outlook = "Early / High Risk"

            return {
                "acquisition_probability": round(prob, 4),
                "acquisition_percentage": round(prob * 100, 1),
                "outlook": outlook,
                "matched_category": category,
                "overall_historical_acquisition_rate": overall_rate,
                "category_benchmarks": benchmarks,
                "inputs_used": {
                    "funding_total_usd": funding_total,
                    "funding_rounds": funding_rounds,
                    "relationships": relationships,
                    "milestones": milestones,
                },
                "data_note": (
                    "Based on historical Crunchbase/Kaggle startup data; "
                    "investor relationships and milestones carry the strongest weight."
                ),
            }

        except Exception as exc:
            return {
                "acquisition_probability": None,
                "acquisition_percentage": None,
                "outlook": "Unavailable",
                "error": str(exc),
            }
    # --------------------------------------------------
    # Market and business model analysis
    # --------------------------------------------------

    def _get_market_analysis(
        self,
        industry: str
    ) -> Dict[str, Any]:

        summary = self.knowledge_base.get_market_summary(industry)

        if summary is not None:
            return summary

        return {
            "industry": industry,
            "market_type": "",
            "description": (
                f"No specific market data available for '{industry}'. "
                "Treat general observations as hypotheses requiring validation."
            ),
            "target_customers": [],
            "common_problems": [],
            "common_business_models": [],
        }

    def _get_competitor_analysis(
        self,
        industry: str,
    ) -> List[Dict[str, Any]]:

        return (
            self.knowledge_base.get_competitor_summary(industry) or []
        )

    def _get_business_model_fit(
        self,
        business_model: str,
    ) -> Optional[Dict[str, Any]]:

        return self.knowledge_base.get_business_model_summary(
            business_model
        )

    # --------------------------------------------------
    # Risk assessment
    # --------------------------------------------------

    def _analyze_risks(
        self,
        market_analysis: Dict,
        competitor_analysis: List,
        business_model_fit: Optional[Dict],
    ) -> List[Dict[str, Any]]:
        """Derive potential risks from available knowledge."""

        risks: List[Dict[str, Any]] = []
        seen_risks = set()

        def add_risk(risk_text: str, source: str):

            if not risk_text:
                return

            risk_text = str(risk_text).strip()

            if not risk_text or risk_text.lower() in seen_risks:
                return

            seen_risks.add(risk_text.lower())
            risk_lower = risk_text.lower()

            high_keywords = [
                "high competition",
                "competition",
                "regulation",
                "compliance",
                "security",
                "privacy",
                "trust",
            ]

            medium_keywords = [
                "customer acquisition",
                "churn",
                "long sales cycles",
                "sales cycles",
                "retention",
                "pricing",
                "adoption",
            ]

            if any(keyword in risk_lower for keyword in high_keywords):
                severity = "high"

            elif any(
                keyword in risk_lower for keyword in medium_keywords
            ):
                severity = "medium"

            else:
                severity = "low"

            risks.append({
                "risk": risk_text,
                "severity": severity,
                "source": source,
            })

        for problem in market_analysis.get("common_problems", []):
            add_risk(problem, "market")

        for competitor in competitor_analysis:

            weakness = competitor.get("common_weakness", "")

            if weakness:
                add_risk(weakness, "competitor")

        if business_model_fit:

            for challenge in business_model_fit.get("challenges", []):
                add_risk(challenge, "business_model")

        severity_order = {
            "high": 0,
            "medium": 1,
            "low": 2
        }

        risks.sort(
            key=lambda risk: severity_order[risk["severity"]]
        )

        return risks[:8]

    # --------------------------------------------------
    # Strengths and weaknesses
    # --------------------------------------------------

    def _analyze_strengths_weaknesses(
        self,
        startup: Dict,
        classification: str,
        market_analysis: Dict,
        competitor_analysis: List,
        business_model_fit: Optional[Dict],
    ) -> Dict[str, List[str]]:

        strengths: List[str] = []
        weaknesses: List[str] = []

        business_model = str(
            startup.get("businessModel", "")
        ).lower()

        problem = str(startup.get("problem", "")).strip()
        solution = str(startup.get("solution", "")).strip()

        risks = self._analyze_risks(
            market_analysis,
            competitor_analysis,
            business_model_fit,
        )

        risk_texts = [
            risk["risk"].lower()
            for risk in risks
        ]

        if not any("competition" in risk for risk in risk_texts):

            strengths.append(
                "No competition-related risk was identified "
                "in the available knowledge."
            )

        if "subscription" in business_model:

            strengths.append(
                "Subscription pricing may support recurring revenue."
            )

        elif "freemium" in business_model:

            strengths.append(
                "A freemium model may reduce barriers to initial adoption."
            )

        if problem and solution:

            strengths.append(
                "The startup describes both a problem and a proposed solution."
            )

        if any("competition" in risk for risk in risk_texts):

            weaknesses.append(
                "Competition-related risks may require stronger differentiation."
            )

        if any(
            keyword in risk
            for risk in risk_texts
            for keyword in ("regulation", "compliance", "security")
        ):

            weaknesses.append(
                "Potential regulatory, compliance, or security "
                "challenges require further assessment."
            )

        if classification == "B2B" and any(
            "sales cycles" in risk for risk in risk_texts
        ):

            weaknesses.append(
                "B2B sales may involve longer decision cycles."
            )

        if any(
            "customer acquisition" in risk
            for risk in risk_texts
        ):

            weaknesses.append(
                "Customer acquisition may require additional validation."
            )

        return {
            "strengths": strengths,
            "weaknesses": weaknesses,
        }

    # --------------------------------------------------
    # Planning insights from expanded datasets
    # --------------------------------------------------

    def _get_planning_insights(
        self,
        startup: Dict,
        classification: Optional[str],
    ) -> Dict[str, Any]:
        """
        Return planning resources.

        Persona and template data are illustrative, not validated
        recommendations for the individual startup.
        """

        industry = str(startup.get("industry", "")).strip()

        customer_personas = (
            self.knowledge_base.get_customer_personas(limit=10)
        )

        mvp_roadmaps = (
            self.knowledge_base.get_mvp_roadmap_templates(limit=7)
        )

        launch_strategies = (
            self.knowledge_base.get_launch_strategy_templates(limit=6)
        )

        financial_assumptions = (
            self.knowledge_base.get_financial_assumptions(
                industry=industry or None,
                limit=10,
            )
        )

        return {
            "customer_personas": customer_personas,
            "mvp_roadmap_templates": mvp_roadmaps,
            "launch_strategy_templates": launch_strategies,
            "financial_assumptions": financial_assumptions,

            "data_notes": {

                "customer_personas": (
                    "Synthetic hypotheses; validate through customer interviews."
                ),

                "mvp_roadmaps": (
                    "Generic planning templates; adapt to the startup."
                ),

                "launch_strategies": (
                    "Generic launch templates; test channels before scaling."
                ),

                "financial_assumptions": (
                    "Illustrative assumptions, not verified forecasts."
                ),

                "classification": (
                    "ML prediction; validate against the actual target market."
                    if classification
                    else "Classification could not be determined."
                ),
            },
        }

    # --------------------------------------------------
    # Main analysis pipeline
    # --------------------------------------------------

    def analyze(
        self,
        startup: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate a structured startup analysis report."""

        # Preserve every non-empty field submitted by the founder.
        startup_context = {
            str(field): str(value).strip()
            for field, value in startup.items()
            if value is not None and str(value).strip()
        }

        if not startup_context:

            raise ValueError(
                "Please provide at least a startup idea or other details."
            )

        # Keep the original text format for the trained classifier.
        classification_fields = [
            "idea",
            "industry",
            "problem",
            "solution",
            "targetCustomer",
            "businessModel",
        ]

        classification_text = " ".join(
            str(startup.get(field) or "").strip()
            for field in classification_fields
            if str(startup.get(field) or "").strip()
        )

        if classification_text:

            classification, confidence, confidence_label = (
                self._get_classification_confidence(classification_text)
            )

        else:

            classification, confidence, confidence_label = (
                None, None, None
            )

        # Use labeled context for knowledge retrieval.
        retrieval_text = "\n".join(
            f"{field}: {value}"
            for field, value in startup_context.items()
        )

        retrieved_knowledge = self.retriever.search_with_context(
            retrieval_text,
            top_k=5,
            industry=startup.get("industry"),
            business_model=startup.get("businessModel"),
        )

        industry = str(startup.get("industry") or "").strip()

        business_model = str(
            startup.get("businessModel") or ""
        ).strip()

        # Market analysis.
        market_analysis = self._get_market_analysis(industry)

        competitor_analysis = self._get_competitor_analysis(industry)

        business_model_fit = self._get_business_model_fit(
            business_model
        )

        # Risk assessment.
        risk_assessment = self._analyze_risks(
            market_analysis,
            competitor_analysis,
            business_model_fit,
        )

        # Strengths and weaknesses.
        strengths_weaknesses = self._analyze_strengths_weaknesses(
            startup,
            classification or "",
            market_analysis,
            competitor_analysis,
            business_model_fit,
        )

        # Startup planning.
        startup_plan = generate_startup_plan(
            startup,
            classification or "Unknown",
            retrieved_knowledge,
        )

        recommendations = startup_plan.get("recommendations", [])

        # Knowledge insights.
        knowledge_insights = self.retriever.build_insights(
            retrieved_knowledge,
            limit=5,
        )

        # Dataset-based planning insights.
        planning_insights = self._get_planning_insights(
            startup,
            classification,
        )

        # Deterministic financial forecasting.
        financial_forecast = self.financial_forecast.compare_stages(
            industry
        )

        # Historical startup acquisition / success prediction.
        startup_success_analysis = self._get_startup_success_analysis(
            startup
        )

        # Model information.
        model_classes = getattr(
            self.model,
            "classes_",
            ["B2B", "B2C"],
        )

        if hasattr(model_classes, "tolist"):
            model_classes = model_classes.tolist()

        else:
            model_classes = list(model_classes)

        model_info = {
            "model_type": "Logistic Regression (TF-IDF pipeline)",
            "classes": model_classes,
        }

        # Final structured analysis response.
        return {
            "startup": startup,
            "startup_context": startup_context,

            "classification": classification,
            "classification_confidence": confidence,
            "classification_confidence_label": confidence_label,

            "market_analysis": market_analysis,
            "competitor_analysis": competitor_analysis,
            "business_model_fit": business_model_fit,

            "risk_assessment": risk_assessment,

            "strengths": strengths_weaknesses["strengths"],
            "weaknesses": strengths_weaknesses["weaknesses"],

            "recommendations": recommendations,

            "knowledge_insights": knowledge_insights,
            "retrieved_knowledge": retrieved_knowledge,

            "planning_insights": planning_insights,

            "financial_forecast": financial_forecast,

            "startup_success_analysis": startup_success_analysis,

            "model_info": model_info,

            "analysis_scope": {
                "market_data_source": "knowledge_base",
                "market_data_is_live": False,
            },
        }