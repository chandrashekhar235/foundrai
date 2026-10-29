from analyzer import StartupAnalyzer


startup = {
    "startupName": "CodePilot",

    "idea": "AI platform that helps college students prepare for coding interviews",

    "industry": "EdTech",

    "targetCustomer": "College students",

    "location": "India",

    "problem": "Students struggle to prepare for technical interviews",

    "solution": "An AI platform that creates personalized coding interview preparation",

    "businessModel": "Subscription"
}


analyzer = StartupAnalyzer()

result = analyzer.analyze(startup)


print("\n========== FOUNDR AI ANALYSIS ==========\n")


print("Startup:")
print(result["startup"]["startupName"])


print("\nClassification:")
print(result["classification"])


print("\nRetrieved Knowledge:\n")

for item in result["retrieved_knowledge"]:

    print("Type:", item["type"])
    print("Similarity:", item["similarity"])
    print("Information:", item["text"])
    print("----------------------------------------")