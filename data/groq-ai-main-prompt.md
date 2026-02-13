Generate a Harada-style goal breakdown in JSON format using the exact schema below.

RULES:

- Fill out ALL fields.
- Create EXACTLY 8 subGoals.
- Each subGoal must contain EXACTLY 8 short, actionable tasks.
- All fields must be non-empty strings.
- Return VALID JSON ONLY. No commentary. No code blocks.
- Title and Description fields should use friendly, plain language.

SCHEMA TO FOLLOW EXACTLY:

{
"title": "",
"description: "",
"mainGoal": "{{GOAL}}",
"subGoals": [
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
},
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
},
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
},
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
},
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
},
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
},
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
},
{
"subGoal": "",
"tasks": ["", "", "", "", "", "", "", ""]
}
]
}
