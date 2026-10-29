def generate_startup_plan(startup, classification, retrieved_knowledge):

    plan = {
        "startup_name": startup["startupName"],
        "classification": classification,

        "market": {
            "industry": startup["industry"],
            "location": startup.get("location", ""),
            "target_customer": startup.get("targetCustomer", ""),
        },

        "problem": startup["problem"],

        "solution": startup["solution"],

        "business_model": startup["businessModel"],

        "knowledge_insights": [],

        "recommendations": []
    }

    # Add information retrieved from our knowledge base
    for item in retrieved_knowledge:

        plan["knowledge_insights"].append({
            "type": item.get("type"),
            "information": item.get("text"),
            "similarity": item.get("similarity")
        })

    # Base recommendations (validated problem, MVP, etc.)
    base_recs = [
        {
            "title": "Validate the problem first",
            "description": "Talk to at least 10-20 target customers before writing code to confirm they actually face this problem.",
            "priority": "high",
            "timeline": "1-2 weeks",
            "key_metrics": "Number of customer interviews, problem validation rate"
        },
        {
            "title": "Build an MVP",
            "description": "Ship a minimal version of your product quickly and test it with real users to start learning.",
            "priority": "high",
            "timeline": "2-4 weeks",
            "key_metrics": "MVP feature set, early user sign-ups"
        },
        {
            "title": "Study your competitors",
            "description": "Analyze at least 3-5 direct competitors to find gaps you can exploit and differentiate against.",
            "priority": "high",
            "timeline": "1 week",
            "key_metrics": "Competitor list, identified differentiation points"
        },
        {
            "title": "Iterate on feedback",
            "description": "Use early user feedback to refine your product before scaling. Build-measure-learn loop.",
            "priority": "medium",
            "timeline": "Ongoing",
            "key_metrics": "User retention, feature usage, NPS"
        }
    ]

    # Classification-specific phase recommendations
    classification_phases = {
        "B2B": [
            {
                "title": "Map the B2B buying committee",
                "description": "Identify all stakeholders (end users, influencers, economic buyers) in the purchase decision. Understand each constituency's priorities.",
                "priority": "high",
                "timeline": "1-2 weeks",
                "key_metrics": "Stakeholder map completed, decision criteria documented"
            },
            {
                "title": "Quantify ROI for purchase",
                "description": "B2B buyers need a clear return-on-investment case. Quantify time saved, cost avoided, or revenue added.",
                "priority": "high",
                "timeline": "2-3 weeks",
                "key_metrics": "ROI model built, champions identified"
            }
        ],
        "B2C": [
            {
                "title": "Focus on user onboarding & activation",
                "description": "B2C growth depends heavily on first-time user experience and quick time-to-value. Design a frictionless onboarding flow.",
                "priority": "high",
                "timeline": "1 week",
                "key_metrics": "Activation rate, time-to-first-value, early retention"
            },
            {
                "title": "Invest in word-of-mouth loops",
                "description": "B2C growth relies on viral or referral mechanisms. Design your product and marketing to encourage sharing and recommendations.",
                "priority": "medium",
                "timeline": "2-4 weeks",
                "key_metrics": "Referral rate, organic growth coefficient, CAC payback period"
            }
        ]
    }

    # Business-model-specific phase recommendations
    model_phases = {
        "Subscription": [
            {
                "title": "Design low-churn onboarding",
                "description": "Subscription models require customers to find ongoing value. Invest in welcome sequences, periodic check-ins, and quick win moments.",
                "priority": "high",
                "timeline": "2 weeks",
                "key_metrics": "30-day retention rate, churn in first 90 days"
            },
            {
                "title": "Establish periodic value communication",
                "description": "Remind subscribers of the value they receive monthly/quarterly. Use newsletters, feature roundups, and customer success stories.",
                "priority": "medium",
                "timeline": "Ongoing",
                "key_metrics": "Renewal rate, NPS, support ticket volume"
            }
        ],
        "Freemium": [
            {
                "title": "Design a compelling upgrade funnel",
                "description": "Freemium needs a strong conversion path from free to paid. Optimize your upgrade prompts, value demonstration, and pricing page.",
                "priority": "high",
                "timeline": "2-3 weeks",
                "key_metrics": "Free-to-paid conversion rate, time-from-free-to-paid"
            },
            {
                "title": "Protect core value in free tier",
                "description": "Ensure the free tier delivers genuine value while leaving paid features clearly differentiated.",
                "priority": "medium",
                "timeline": "1 week",
                "key_metrics": "Free user engagement, upgrade triggers"
            }
        ],
        "Commission": [
            {
                "title": "Focus on transaction liquidity",
                "description": "Commission models require sufficient transaction volume. Prioritize getting enough buyers and sellers interacting on your platform.",
                "priority": "high",
                "timeline": "2-4 weeks",
                "key_metrics": "Monthly transaction volume, take-rate, active participants"
            },
            {
                "title": "Build trust and transparency",
                "description": "Users need to trust the platform with their transactions. Be transparent about fees, security, and dispute resolution.",
                "priority": "high",
                "timeline": "1 week",
                "key_metrics": "Trust score, dispute rate, repeat transaction rate"
            }
        ],
        "Licensing": [
            {
                "title": "Prepare legal-ready documentation",
                "description": "Licensing deals involve contracts, IP rights, and compliance. Build template agreements and consult IP counsel early.",
                "priority": "high",
                "timeline": "2-4 weeks",
                "key_metrics": "Contracts signed, licensing revenue, deal velocity"
            },
            {
                "title": "Identify decision-makers at target firms",
                "description": "B2B licensing targets large institutions. Map the procurement/legal teams and understand approval cycles.",
                "priority": "high",
                "timeline": "2-3 weeks",
                "key_metrics": "Prospects engaged, approval cycles documented, pilots booked"
            }
        ]
    }

    # Merge base recommendations
    plan["recommendations"] = base_recs

    # Add classification-specific phases
    if classification in classification_phases:
        plan["recommendations"].extend(classification_phases[classification])

    # Add business-model-specific phases
    if startup.get("businessModel") in model_phases:
        plan["recommendations"].extend(model_phases[startup["businessModel"]])

    # Deduplicate recommendations by title (keep first occurrence)
    seen = set()
    deduped = []
    for rec in plan["recommendations"]:
        if rec["title"] not in seen:
            seen.add(rec["title"])
            deduped.append(rec)
    plan["recommendations"] = deduped

    return plan