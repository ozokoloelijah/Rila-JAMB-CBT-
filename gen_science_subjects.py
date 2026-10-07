#!/usr/bin/env python3
"""
Generator for Chemistry, Biology, and Mathematics questions (500 each)
for JAMB UTME Practice Engine.
"""
import json
import random

random.seed(101)

def write_subject_file(filepath, var_name, subject_id, questions_list):
    lines = [
        "import { Question } from '../../types';\n",
        f"export const {var_name}: Question[] = ["
    ]
    for q in questions_list:
        lines.append("  {")
        lines.append(f"    id: {json.dumps(q['id'])},")
        lines.append(f"    subjectId: '{subject_id}',")
        lines.append(f"    year: {q['year']},")
        lines.append(f"    topic: {json.dumps(q['topic'])},")
        lines.append(f"    question: {json.dumps(q['question'])},")
        lines.append("    options: [")
        for opt in q['options']:
            lines.append(f"      {{ key: '{opt['key']}', text: {json.dumps(opt['text'])} }},")
        lines.append("    ],")
        lines.append(f"    correctAnswer: '{q['correctAnswer']}',")
        lines.append(f"    explanation: {json.dumps(q['explanation'])},")
        lines.append("  },")
    lines.append("];\n")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print(f"Successfully wrote {len(questions_list)} questions to {filepath}")

print("Science builder setup loaded.")
