import json
from collections import Counter

# Based on the teams data you provided, here's a comprehensive analysis
print("🔍 AGENT LABS HACKATHON - TEAM ANALYSIS")
print("=" * 50)

# Key insights from the data you provided
print(f"\n📊 BASIC STATISTICS:")
print(f"Total Teams: 103")
print(f"Teams per page: 103")
print(f"Pages: 1")

# Analysis of team descriptions and names from your data
teams_analysis = [
    # AI/Agent focused teams
    {"name": "BlackNoir", "description": "Guided by the philosophy that \"It's not who we are underneath, but what we do that defines us,\" BlackNoir embodies discipline, stealth, and precision.", "professions": ["Data and AI", "Back-End Developer"]},
    {"name": "AgentOps", "description": "Build with Ai for better future", "professions": ["Data and AI", "Management", "Designer", "Communications", "Back-End Developer", "Front-End Developer", "Business"]},
    {"name": "The Arc Trio", "description": "Team Arc — three friends (Nameer, Didier, and Ivy) combining creativity, technical skill, and hustle to build elegant, user-focused solutions fast.", "professions": ["Back-End Developer", "Front-End Developer", "Data and AI", "Management", "Business", "Communications", "Designer"]},
    {"name": "Neural Capital", "description": "Neural Capital builds AI Broker — a 24/7 financial agent that delivers market insights, portfolio optimization, and smart investing.", "professions": ["Designer", "Communications"]},
    {"name": "NeuraNova", "description": "Team NeuraNova – Likhith, Hemanth, and Balu, passionate about Generative AI. We build innovative, impactful solutions that shine like a nova. ✨", "professions": []},
    {"name": "Agent Hackers", "description": "Agent Hackers – Building the future with AI agents.", "professions": []},
    {"name": "NeuroAgent", "description": "Neuroagents—specialized, interoperable AI agents—can transform mental health support. Agents that track stress, detect burnout, or guide mindfulness.", "professions": ["Business"]},
    {"name": "Kairos", "description": "We build adaptive AI agents that think, learn, and act—transforming automation into true intelligence.", "professions": []},
    {"name": "AI A-Star Group", "description": "Decentralized intelligence powered by Web3 x AI.", "professions": []},
    {"name": "Synapse Agents", "description": "A hub where diverse AI agents connect, communicate, and solve problems seamlessly, just like a neural network in action.", "professions": []},
    {"name": "Agent zero", "description": "As a fresh software Engineering Graduate with hands on Experience in blockchain and Ai technologies, I aim to explore how autonomous agents work.", "professions": []},
    {"name": "Team Alpha", "description": "Aiming to build AI Agents that can be act as personal assistant.", "professions": ["Data and AI", "Front-End Developer", "Designer", "Back-End Developer"]},
    {"name": "Peka Coders", "description": "A reusable AI agent to help in Programming and interviews.", "professions": ["Designer", "Data and AI", "Back-End Developer", "Front-End Developer"]},
    {"name": "GenAIus", "description": "A solo innovator passionate about AI, building fast, practical, and creative solutions that make real-world impact.", "professions": []},
    {"name": "IntelliFlow", "description": "Building next-gen autonomous AI systems to optimize business workflows & agent collaboration. High impact, scalable, API-ready", "professions": ["Data and AI", "Management", "Business", "Communications", "Designer", "Back-End Developer", "Front-End Developer"]},
    {"name": "Legion of Agents", "description": "Legion of Agents is a global force of data scientists & devs, fueled by intelligence and decentralization, reclaiming innovation with AI agents.", "professions": []},
    
    # Healthcare focused
    {"name": "The Rainmakers", "description": "Disrupting Healthcare for better Co-ordination, Care and Service.", "professions": ["Data and AI", "Business", "Front-End Developer", "Back-End Developer", "Communications", "Designer"]},
    {"name": "Team Cero Dolor", "description": "We'll be developing the \"Cero Dolor\" (zero pain) App, an app that uses our knowledge and agentic tech to help ease people's chronic pain.", "professions": []},
    
    # Finance focused
    {"name": "Neural Capital", "description": "Neural Capital builds AI Broker — a 24/7 financial agent that delivers market insights, portfolio optimization, and smart investing.", "professions": ["Designer", "Communications"]},
    {"name": "LedgerPe", "description": "Here to build the future of agentic payments", "professions": []},
    {"name": "CaffeineCoders", "description": "Building the next generation of payments", "professions": ["Business", "Data and AI", "Front-End Developer", "Designer"]},
    
    # Business/Productivity focused
    {"name": "You & Me Lab", "description": "Let's Build Something Amazing Together by Using Human & Machine Intelligence.", "professions": ["Designer", "Data and AI", "Management", "Front-End Developer", "Business", "Communications"]},
    {"name": "1ne", "description": "vibe coding our way into vc's wallets", "professions": ["Business", "Management", "Front-End Developer", "Designer"]},
    {"name": "CollectiveIQ", "description": "Turning scattered data into smart decisions with the power of agents.", "professions": []},
    {"name": "StartAI", "description": "StartAI is an AI-powered advisory platform connecting founders, mentors, and investors with personalized guidance and idea evaluation.", "professions": ["Data and AI", "Back-End Developer", "Front-End Developer"]},
    
    # Creative/Design focused
    {"name": "Yyvexa Labs", "description": "Yyvexa Labs experiments at the edge of AI and UX, designing adaptive dashboards and agent-driven systems for smarter, more personal tech", "professions": []},
    {"name": "Solex", "description": "Hack that thang - Making certification on any artistic asset", "professions": ["Data and AI", "Business"]},
    
    # Security focused
    {"name": "PhantomSec", "description": "PhantomSec Devs. Crafting AI and Security Solutions", "professions": []},
    {"name": "Sage", "description": "Exploring how agentic software can strengthen security workflows by making them adaptive and intelligent.", "professions": ["Management", "Front-End Developer", "Communications", "Business"]},
    
    # Development focused
    {"name": "TrigsLink", "description": "We are building a decentralized MCP Mesh for AI Agents", "professions": []},
    {"name": "codeStein", "description": "We turn ideas into solution.", "professions": []},
    {"name": "Jargon Warriors", "description": "Slaying complex code and impenetrable jargon, one elegant solution at a time. We're on a quest to make tech clear, concise, and accessible.", "professions": []},
]

print(f"\n🤖 AI/AGENT FOCUS ANALYSIS:")
ai_keywords = ["ai", "agent", "artificial intelligence", "machine learning", "ml", "neural", "autonomous", "intelligent", "smart", "automation"]

ai_focused_count = 0
for team in teams_analysis:
    description = team["description"].lower()
    name = team["name"].lower()
    text = f"{name} {description}"
    
    ai_score = sum(1 for keyword in ai_keywords if keyword in text)
    if ai_score > 0:
        ai_focused_count += 1

print(f"Teams with AI/Agent Focus: {ai_focused_count} out of {len(teams_analysis)} analyzed ({ai_focused_count/len(teams_analysis)*100:.1f}%)")

print(f"\n🎯 DOMAIN ANALYSIS:")
domains = {
    "Healthcare": ["health", "medical", "pain", "therapy", "wellness", "mental health"],
    "Finance": ["financial", "trading", "investment", "portfolio", "payment", "crypto", "blockchain"],
    "Education": ["education", "learning", "teaching", "student", "academic"],
    "Business": ["business", "management", "workflow", "productivity", "enterprise"],
    "Security": ["security", "cyber", "protection", "safety", "privacy"],
    "Creative": ["creative", "design", "art", "content", "media", "entertainment"],
    "Development": ["development", "coding", "programming", "software", "tech", "dev"],
    "Communication": ["communication", "chat", "messaging", "social", "collaboration"]
}

domain_counts = {domain: 0 for domain in domains.keys()}

for team in teams_analysis:
    description = team["description"].lower()
    name = team["name"].lower()
    text = f"{name} {description}"
    
    for domain, keywords in domains.items():
        if any(keyword in text for keyword in keywords):
            domain_counts[domain] += 1

print("Teams by Domain Focus:")
for domain, count in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True):
    if count > 0:
        print(f"  {domain}: {count} teams")

print(f"\n👥 PROFESSION ANALYSIS:")
all_professions = []
for team in teams_analysis:
    all_professions.extend(team["professions"])

profession_counts = Counter(all_professions)
print("Most Popular Professions:")
for prof, count in profession_counts.most_common():
    print(f"  {prof}: {count} teams")

print(f"\n🚀 KEY INSIGHTS & RECOMMENDATIONS:")
print("\n1. COMMON AGENT TYPES BEING BUILT:")
print("   • Personal Assistant Agents (Team Alpha, Agent zero)")
print("   • Financial/Trading Agents (Neural Capital, LedgerPe)")
print("   • Healthcare Support Agents (NeuroAgent, The Rainmakers, Team Cero Dolor)")
print("   • Business Workflow Agents (IntelliFlow, CollectiveIQ)")
print("   • Development/Programming Agents (Peka Coders)")
print("   • Multi-Agent Systems (Synapse Agents, Legion of Agents)")

print("\n2. EMERGING TRENDS:")
print("   • Web3 + AI integration (AI A-Star Group, TrigsLink)")
print("   • Healthcare AI applications (pain management, mental health)")
print("   • Financial AI (trading, payments, portfolio optimization)")
print("   • Developer productivity tools")
print("   • Multi-agent collaboration platforms")

print("\n3. CATEGORIES TO AUTOMATE:")
print("   • Personal Productivity & Assistant")
print("   • Healthcare & Wellness")
print("   • Finance & Trading")
print("   • Development & DevOps")
print("   • Business Intelligence")
print("   • Security & Privacy")
print("   • Creative & Design")

print("\n4. SUCCESS FACTORS OBSERVED:")
print("   • Clear problem definition")
print("   • Multi-disciplinary teams")
print("   • Focus on real-world impact")
print("   • Integration with existing workflows")
print("   • User-friendly interfaces")
print("   • Scalable architecture")

print("\n5. OPPORTUNITIES FOR YOUR PLATFORM:")
print("   • Agent marketplace/templates")
print("   • Multi-agent orchestration tools")
print("   • Industry-specific agent solutions")
print("   • Agent collaboration frameworks")
print("   • Integration with popular tools")
print("   • Agent performance analytics")

print(f"\n💡 NEXT STEPS:")
print("   1. Create agent templates for popular use cases")
print("   2. Build multi-agent orchestration capabilities")
print("   3. Develop industry-specific solutions")
print("   4. Focus on integration and interoperability")
print("   5. Create agent marketplace/registry")
print("   6. Build analytics and monitoring tools")
