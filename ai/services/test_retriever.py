from analyzer import StartupAnalyzer


startup = {

    "startupName": "CodePilot",

    "idea": """
    AI platform that helps college students
    prepare for coding interviews
    """,

    "industry": "EdTech",

    "targetCustomer": "College students",

    "location": "India",

    "problem": """
    Students struggle to prepare for
    technical interviews
    """,

    "solution": """
    Personalized AI coding interview
    preparation platform
    """,

    "businessModel": "Subscription"
}


analyzer = StartupAnalyzer()

result = analyzer.analyze(startup)


print("\n========== FOUNDR AI ==========\n")

print("Startup:")
print(result["startup"]["startupName"])

print("\nClassification:")
print(result["classification"])

print("\nRelevant Knowledge:\n")


for item in result["retrieved_knowledge"]:

    print("Type:", item["type"])
    print("Similarity:", item["similarity"])
    print("Information:", item["text"])
    print("--------------------------------")