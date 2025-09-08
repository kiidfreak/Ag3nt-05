import json

# The teams data you provided in your message
teams_data = {
    "teams": [
        {
            "callingForHelp": False,
            "channelGuildId": None,
            "description": "TODAY IS A GOODDAY TO HAVE A GOODDAY",
            "eventId": "cmdqo8hk1000f3572ulnerdh0",
            "id": "cmee8oj9w0015336w7w6u5fba",
            "lookingForMembers": False,
            "name": "isikurakahle",
            "picture": "https://storage.googleapis.com/lablab-static-eu/images/midjourney/team/team%20(20).png",
            "textChannelId": None,
            "slug": "isikurakahle",
            "voiceChannelId": None,
            "timeZone": "UTC 0:00",
            "professions": [],
            "participants": [
                {
                    "user": {
                        "id": "cmajgsaqf00119q0sswgdp8c2",
                        "profile": {
                            "firstName": None,
                            "lastName": None,
                            "picture": "https://avatars.githubusercontent.com/u/174347520?v=4",
                            "id": "cmajgsas400028z0r8rf2pflz",
                            "userName": "musa_caleb_mashamba220"
                        },
                        "image": "https://avatars.githubusercontent.com/u/174347520?v=4"
                    }
                }
            ]
        },
        {
            "callingForHelp": False,
            "channelGuildId": None,
            "description": "Even if we alay, we crush everyone",
            "eventId": "cmdqo8hk1000f3572ulnerdh0",
            "id": "cmeef7fdy0029356ncdh55c55",
            "lookingForMembers": False,
            "name": "Alayers",
            "picture": "https://storage.googleapis.com/lablab-static-eu/images/midjourney/team/team%20(3).png",
            "textChannelId": None,
            "slug": "alayers",
            "voiceChannelId": None,
            "timeZone": "UTC +7:00",
            "professions": [],
            "participants": [
                {
                    "user": {
                        "id": "cm3wdus690000rmcj1neu7n7n",
                        "profile": {
                            "firstName": None,
                            "lastName": None,
                            "picture": "https://avatars.githubusercontent.com/u/70733740?v=4",
                            "id": "cm3wdus7700a5ya0e45slhauv",
                            "userName": "alayers2804780"
                        },
                        "image": "https://avatars.githubusercontent.com/u/70733740?v=4"
                    }
                }
            ]
        },
        {
            "callingForHelp": False,
            "channelGuildId": None,
            "description": "Guided by the philosophy that \"It's not who we are underneath, but what we do that defines us,\" BlackNoir embodies discipline, stealth, and precision.",
            "eventId": "cmdqo8hk1000f3572ulnerdh0",
            "id": "cmegypmyh00273b6tetx1p1x7",
            "lookingForMembers": True,
            "name": "BlackNoir",
            "picture": "https://storage.googleapis.com/lablab-static-eu/images/teams/internet-of-agents/cmegypmyh00273b6tetx1p1x7_imageLink_ba6ccj04pq.jpg",
            "textChannelId": None,
            "slug": "blacknoir",
            "voiceChannelId": None,
            "timeZone": "UTC +5:30",
            "professions": [
                {"profession": {"name": "Data and AI", "slug": "data-and-ai", "color": "blue-100"}},
                {"profession": {"name": "Back-End Developer", "slug": "back-end-developer", "color": "blue-100"}}
            ],
            "participants": [
                {
                    "user": {
                        "id": "cmegvu4s600zde90r0apol2xm",
                        "profile": {
                            "firstName": None,
                            "lastName": None,
                            "picture": "https://avatars.githubusercontent.com/u/158809630?v=4",
                            "id": "cmegvu4uk00lxdz0s0v958vb0",
                            "userName": "aman_singh238"
                        },
                        "image": "https://avatars.githubusercontent.com/u/158809630?v=4"
                    }
                }
            ]
        }
        # Note: I'm including just a few examples here due to length constraints
        # The full data would include all 103 teams
    ],
    "teamsCount": 103,
    "pagesCount": 1,
    "teamsPerPage": "103",
    "lookingForRoles": [
        {"name": "Data and AI", "slug": "data-and-ai"},
        {"name": "Back-End Developer", "slug": "back-end-developer"},
        {"name": "Management", "slug": "management"},
        {"name": "Designer", "slug": "designer"},
        {"name": "Communications", "slug": "communications"},
        {"name": "Front-End Developer", "slug": "front-end-developer"},
        {"name": "Business", "slug": "business"}
    ],
    "teamTimeZones": ["All Timezones", "UTC +5:30", "UTC 0:00", "UTC +5:00", "UTC +3:00", "UTC +1:00", "UTC +8:00", "UTC -4:00", "UTC -5:00", "UTC +12:45", "UTC +6:00"]
}

# Save to JSON file
with open("hackathon_teams.json", "w", encoding="utf-8") as f:
    json.dump(teams_data, f, indent=2, ensure_ascii=False)

print("✅ Created hackathon_teams.json with sample data")
print("Note: This contains a sample of the teams data you provided.")
print("For full analysis, we would need the complete dataset.")
