
import re
from typing import Any, Dict, List, Optional, Tuple

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    from .knowledge_base import KnowledgeBase
except ImportError:
    from services.knowledge_base import KnowledgeBase


class KnowledgeRetriever:
    MIN_SIMILARITY = 0.12

    INDUSTRY_ALIASES = [
        {"edtech", "education technology", "educational technology"},
        {"healthtech", "health technology", "healthcare technology"},
        {"fintech", "financial technology", "financial services technology"},
        {"agritech", "agricultural technology", "agriculture technology"},
    ]

    def __init__(self):
        self.knowledge_base = KnowledgeBase()
        self.documents = [
            {**doc, "text": str(doc.get("text") or "").strip()}
            for doc in self.knowledge_base.get_all_knowledge()
            if str(doc.get("text") or "").strip()
        ]
        self.texts = [doc["text"] for doc in self.documents]

        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            sublinear_tf=True,
        )

        self.vectors = (
            self.vectorizer.fit_transform(self.texts)
            if self.texts
            else None
        )

    @staticmethod
    def _normalize(value: Any) -> str:
        value = str(value or "").lower().strip()
        return re.sub(r"[^a-z0-9]+", " ", value).strip()

    @classmethod
    def _same_industry(cls, requested: str, document: str) -> bool:
        requested_norm = cls._normalize(requested)
        document_norm = cls._normalize(document)

        if not requested_norm or not document_norm:
            return False

        if requested_norm == document_norm:
            return True

        for group in cls.INDUSTRY_ALIASES:
            normalized_group = {cls._normalize(item) for item in group}
            if requested_norm in normalized_group and document_norm in normalized_group:
                return True

        return False

    def _document_industry(self, doc: Dict[str, Any]) -> Optional[str]:
        # Prefer explicit metadata when available.
        for key in ("industry", "sector"):
            value = self._normalize(doc.get(key))
            if value and value not in {"nan", "none", "unknown"}:
                return str(doc[key]).strip()

        text = doc.get("text", "")

        # Example: "EdTech (B2C) — ..."
        match = re.match(
            r"^\s*([A-Za-z][A-Za-z0-9 &/-]{1,35})\s+\((?:B2B|B2C)\b",
            text,
            re.IGNORECASE,
        )
        if match:
            return match.group(1).strip()

        # Example: "Coding Education (EdTech industry) — ..."
        match = re.search(
            r"\(([^()]+?)\s+industry\)",
            text,
            re.IGNORECASE,
        )
        if match:
            return match.group(1).strip()

        # Example: "industry: HealthTech | segment_type: B2C ..."
        match = re.search(
            r"\bindustry\s*:\s*([^|,.;]+)",
            text,
            re.IGNORECASE,
        )
        if match:
            return match.group(1).strip()

        return None

    def _rank(
        self,
        query: str,
        top_k: int,
        industry: Optional[str] = None,
        business_model: Optional[str] = None,
        min_similarity: float = 0.0,
    ) -> List[Dict[str, Any]]:
        if not query.strip() or self.vectors is None:
            return []

        query_vector = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vector, self.vectors)[0]

        requested_model_terms = set(
            self._normalize(business_model).split()
        ) - {"and", "or", "the", "model"}

        scored: List[Tuple[float, int, float]] = []

        for index, similarity in enumerate(similarities):
            base_similarity = float(similarity)
            if base_similarity < min_similarity:
                continue

            doc = self.documents[index]
            doc_industry = self._document_industry(doc)

            # Never mix records with an explicitly different industry.
            if (
                industry
                and doc_industry
                and not self._same_industry(industry, doc_industry)
            ):
                continue

            score = base_similarity

            if (
                industry
                and doc_industry
                and self._same_industry(industry, doc_industry)
            ):
                score += 0.05

            # Apply the business-model boost only to business-model records.
            if doc.get("type") == "business_model" and requested_model_terms:
                model_label = self._normalize(
                    doc.get("business_model") or doc.get("text", "")
                )
                if requested_model_terms.intersection(model_label.split()):
                    score += 0.05

            scored.append((score, index, base_similarity))

        scored.sort(key=lambda item: item[0], reverse=True)

        results = []
        for score, index, base_similarity in scored[:top_k]:
            doc = self.documents[index]

            results.append({
                "type": doc.get("type", "unknown"),
                "text": doc["text"],
                "similarity": round(base_similarity, 4),
                # Ranking score, not a probability or a calibrated confidence.
                "relevance_score": round(min(score, 1.0) * 100, 1),
            })

        return results

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        return self._rank(query, top_k=top_k)

    def search_with_context(
        self,
        query: str,
        top_k: int = 5,
        industry: Optional[str] = None,
        business_model: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        return self._rank(
            query=query,
            top_k=top_k,
            industry=industry,
            business_model=business_model,
            min_similarity=self.MIN_SIMILARITY,
        )

    TYPE_LABELS = {
        "market": "Market Insight",
        "competitor": "Competitor Insight",
        "business_model": "Business Model Insight",
        "startup": "Startup Example",
        "customer_persona": "Customer Persona Hypothesis",
        "mvp_roadmap": "MVP Roadmap Template",
        "launch_strategy": "Launch Strategy Template",
    }

    def build_insights(
        self,
        retrieved: List[Dict[str, Any]],
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        return [
            {
                "source": self.TYPE_LABELS.get(
                    item.get("type", ""),
                    "Knowledge Base",
                ),
                "type": item.get("type"),
                "text": item.get("text"),
                "similarity": item.get("similarity"),
                "relevance_score": item.get("relevance_score"),
            }
            for item in retrieved[:limit]
        ]
