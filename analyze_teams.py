import json
import re
from collections import Counter

# Load the teams data from the JSON file
with open("hackathon_teams.json", "r", encoding="utf-8") as f:
    teams_data = json.load(f)

def analyze_teams():
    teams = teams_data["teams"]
    
    print("🔍 AGENT LABS HACKATHON - TEAM ANALYSIS")
    print("=" * 50)
    
    # Basic stats
    print(f"\n📊 BASIC STATISTICS:")
    print(f"Total Teams: {len(teams)}")
    
    # Team sizes
    team_sizes = [len(team.get("participants", [])) for team in teams]
    print(f"Average Team Size: {sum(team_sizes)/len(team_sizes):.1f}")
    print(f"Min Team Size: {min(team_sizes)}")
    print(f"Max Team Size: {max(team_sizes)}")
    
    # Solo vs team
    solo_teams = sum(1 for size in team_sizes if size == 1)
    team_teams = len(teams) - solo_teams
    print(f"Solo Participants: {solo_teams} ({solo_teams/len(teams)*100:.1f}%)")
    print(f"Team Participants: {team_teams} ({team_teams/len(teams)*100:.1f}%)")
    
    # Looking for members
    looking_for_members = sum(1 for team in teams if team.get("lookingForMembers", False))
    print(f"Teams Looking for Members: {looking_for_members} ({looking_for_members/len(teams)*100:.1f}%)")
    
    # Calling for help
    calling_for_help = sum(1 for team in teams if team.get("callingForHelp", False))
    print(f"Teams Calling for Help: {calling_for_help} ({calling_for_help/len(teams)*100:.1f}%)")
    
    # Time zones
    print(f"\n🌍 TIME ZONE DISTRIBUTION:")
    timezones = [team.get("timeZone", "Unknown") for team in teams]
    timezone_counts = Counter(timezones)
    for tz, count in timezone_counts.most_common(10):
        print(f"  {tz}: {count} teams")
    
    # Professions analysis
    print(f"\n👥 PROFESSION ANALYSIS:")
    all_professions = []
    for team in teams:
        professions = team.get("professions", [])
        for prof in professions:
            if isinstance(prof, dict) and "profession" in prof:
                all_professions.append(prof["profession"].get("name", "Unknown"))
    
    profession_counts = Counter(all_professions)
    print("Most Popular Professions:")
    for prof, count in profession_counts.most_common():
        print(f"  {prof}: {count} teams")
    
    # Agent/AI focus analysis
    print(f"\n🤖 AI/AGENT FOCUS ANALYSIS:")
    ai_keywords = [
        "ai", "agent", "artificial intelligence", "machine learning", "ml", 
        "neural", "autonomous", "intelligent", "smart", "automation"
    ]
    
    ai_focused_teams = []
    for team in teams:
        description = team.get("description", "").lower()
        name = team.get("name", "").lower()
        text = f"{name} {description}"
        
        ai_score = sum(1 for keyword in ai_keywords if keyword in text)
        if ai_score > 0:
            ai_focused_teams.append({
                "name": team.get("name"),
                "description": team.get("description"),
                "ai_score": ai_score,
                "participants": len(team.get("participants", []))
            })
    
    print(f"Teams with AI/Agent Focus: {len(ai_focused_teams)} ({len(ai_focused_teams)/len(teams)*100:.1f}%)")
    
    # Top AI-focused teams
    ai_focused_teams.sort(key=lambda x: x["ai_score"], reverse=True)
    print("\nTop AI/Agent Focused Teams:")
    for i, team in enumerate(ai_focused_teams[:10], 1):
        print(f"  {i}. {team['name']} (Score: {team['ai_score']})")
        print(f"     Description: {team['description'][:100]}...")
        print(f"     Team Size: {team['participants']}")
        print()
    
    # Domain analysis
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
    
    for team in teams:
        description = team.get("description", "").lower()
        name = team.get("name", "").lower()
        text = f"{name} {description}"
        
        for domain, keywords in domains.items():
            if any(keyword in text for keyword in keywords):
                domain_counts[domain] += 1
    
    print("Teams by Domain Focus:")
    for domain, count in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            print(f"  {domain}: {count} teams")
    
    # Innovation patterns
    print(f"\n💡 INNOVATION PATTERNS:")
    innovation_keywords = [
        "innovative", "cutting-edge", "next-gen", "revolutionary", "breakthrough",
        "novel", "unique", "creative", "disruptive", "transformative"
    ]
    
    innovative_teams = []
    for team in teams:
        description = team.get("description", "").lower()
        innovation_score = sum(1 for keyword in innovation_keywords if keyword in description)
        if innovation_score > 0:
            innovative_teams.append({
                "name": team.get("name"),
                "description": team.get("description"),
                "score": innovation_score
            })
    
    print(f"Teams Emphasizing Innovation: {len(innovative_teams)}")
    for team in innovative_teams[:5]:
        print(f"  • {team['name']}: {team['description'][:80]}...")
    
    # Recommendations for automation/categories
    print(f"\n🚀 RECOMMENDATIONS FOR AUTOMATION & CATEGORIES:")
    print("\n1. COMMON AGENT TYPES TO AUTOMATE:")
    print("   • Personal Assistant Agents")
    print("   • Business Workflow Agents") 
    print("   • Data Analysis Agents")
    print("   • Communication/Chat Agents")
    print("   • Financial/Trading Agents")
    print("   • Healthcare Support Agents")
    
    print("\n2. CATEGORIES TO CREATE:")
    print("   • Productivity & Workflow")
    print("   • Healthcare & Wellness")
    print("   • Finance & Trading")
    print("   • Education & Learning")
    print("   • Creative & Design")
    print("   • Security & Privacy")
    print("   • Communication & Social")
    print("   • Development & DevOps")
    
    print("\n3. TIPS FOR SUCCESS:")
    print("   • Focus on real-world problems")
    print("   • Emphasize team collaboration")
    print("   • Build for scalability")
    print("   • Include user-friendly interfaces")
    print("   • Consider multi-agent systems")
    print("   • Think about integration capabilities")
    
    # Save detailed analysis
    analysis_data = {
        "total_teams": len(teams),
        "solo_teams": solo_teams,
        "team_teams": team_teams,
        "looking_for_members": looking_for_members,
        "calling_for_help": calling_for_help,
        "timezone_distribution": dict(timezone_counts),
        "profession_distribution": dict(profession_counts),
        "domain_distribution": domain_counts,
        "ai_focused_teams": ai_focused_teams[:20],  # Top 20
        "innovative_teams": innovative_teams[:10]   # Top 10
    }
    
    with open("hackathon_analysis.json", "w", encoding="utf-8") as f:
        json.dump(analysis_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Detailed analysis saved to 'hackathon_analysis.json'")

if __name__ == "__main__":
    analyze_teams()