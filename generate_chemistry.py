#!/usr/bin/env python3
import json
import random

questions = []

def add_q(topic, q_text, a, b, c, d, ans, exp, yr=2024):
    qid = f"chm-{len(questions) + 1:03d}"
    questions.append({
        "id": qid,
        "subjectId": "chemistry",
        "year": yr,
        "topic": topic,
        "question": q_text,
        "options": [
            {"key": "A", "text": str(a)},
            {"key": "B", "text": str(b)},
            {"key": "C", "text": str(c)},
            {"key": "D", "text": str(d)}
        ],
        "correctAnswer": ans,
        "explanation": exp
    })

# We will generate comprehensive questions across all 19 topics
print("Starting Chemistry generator...")
