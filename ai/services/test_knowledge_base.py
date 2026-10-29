from knowledge_base import KnowledgeBase


kb = KnowledgeBase()

market = kb.get_market_information("EdTech")

print("MARKET INFORMATION")
print(market)

competitors = kb.get_competitors("EdTech")

print("\nCOMPETITORS")
print(competitors)

business_models = kb.get_business_models("Subscription")

print("\nBUSINESS MODEL")
print(business_models)