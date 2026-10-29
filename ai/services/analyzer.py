
import joblib

from pathlib import Path
from typing import Dict, Any, List, Optional

try:
    from .knowledge_base import KnowledgeBase
    from .retriever import KnowledgeRetriever
    from .startup_plan import generate_startup_plan
except ImportError:
    from services.knowledge_base import KnowledgeBase
    from services.retriever import KnowledgeRetriever
    from services.startup_plan import generate_startup_plan


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "startup_classifier.pkl"


class StartupAnalyzer:
    def __init__(self):
        # Load the trained ML model.
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Startup classifier not found: {MODEL_PATH}"
            )

        self.model = joblib.load(MODEL_PATH)

        # Initialize knowledge base and retriever.
        self.knowledge_base = KnowledgeBase()
        self.retriever = KnowledgeRetriever()

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
    # Market and business model analysis
    # --------------------------------------------------

    def _get_market_analysis(self, industry: str) -> Dict[str, Any]:
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

        severity_order = {"high": 0, "medium": 1, "low": 2}
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

   
    def analyze(self, startup: Dict[str, Any]) -> Dict[str, Any]:
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
            classification, confidence, confidence_label = None, None, None

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
        business_model = str(startup.get("businessModel") or "").strip()

        market_analysis = self._get_market_analysis(industry)
        competitor_analysis = self._get_competitor_analysis(industry)
        business_model_fit = self._get_business_model_fit(business_model)

        risk_assessment = self._analyze_risks(
            market_analysis,
            competitor_analysis,
            business_model_fit,
        )

        strengths_weaknesses = self._analyze_strengths_weaknesses(
            startup,
            classification or "",
            market_analysis,
            competitor_analysis,
            business_model_fit,
        )

        startup_plan = generate_startup_plan(
            startup,
            classification or "Unknown",
            retrieved_knowledge,
        )

        recommendations = startup_plan.get("recommendations", [])

        knowledge_insights = self.retriever.build_insights(
            retrieved_knowledge,
            limit=5,
        )

        planning_insights = self._get_planning_insights(
            startup,
            classification,
        )

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
            "model_info": model_info,
            "analysis_scope": {
                "market_data_source": "knowledge_base",
                "market_data_is_live": False,
            },
        }