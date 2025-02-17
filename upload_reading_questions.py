import json
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import os

# Load environment variables from .env.local
load_dotenv(dotenv_path=".env.local")

# Fetch Supabase database connection variables from your .env.local file.
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# These values should match your loaded passage:
EXAM_ID = "5701eb48-70ab-43d5-b726-e86e0491b4cf"           
PASSAGE_NUMBER = 3              

def load_data(json_file):
    with open(json_file, "r", encoding="utf-8") as f:
        return json.load(f)

def main():
    # Update the path to your JSON file.
    data = load_data("exam_data/academic/reading/feb_2024/passage_{}.json".format(PASSAGE_NUMBER))
    
    conn = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )
    cursor = conn.cursor()

    # Loop through each section in the JSON file.
    for section in data["sections"]:
        section_number = section["section_number"]
        section_header = section["section_header"]
        section_instructions = section["section_instructions"]
        section_question_type = section["section_question_type"]
        
        # Get optional fields if available.
        shared_options = section.get("shared_options")
        content = section.get("content")
        
        # Insert section data into reading_sections table.
        insert_section_query = """
            INSERT INTO reading_sections (
              exam_id, 
              passage_number, 
              section_number, 
              section_header, 
              section_instructions, 
              section_question_type, 
              shared_options, 
              content, 
              created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, now())
            RETURNING id;
        """
        cursor.execute(insert_section_query, (
            EXAM_ID,
            PASSAGE_NUMBER,
            section_number,
            section_header,
            section_instructions,
            section_question_type,
            Json(shared_options) if shared_options is not None else None,
            Json(content) if content is not None else None
        ))
        section_id = cursor.fetchone()[0]
        
        # If the section contains individual questions, insert them.
        if "questions" in section:
            for q in section["questions"]:
                question_number = q["question_number"]
                # Use question-level type if provided, otherwise default to the section's type.
                question_type = q.get("question_type", section_question_type)
                question_text = q["question_text"]
                question_payload = q.get("question_payload", {})
                # correct_answer is omitted in our new JSON; it defaults to null.
                correct_answer = q.get("correct_answer", None)
                
                insert_question_query = """
                    INSERT INTO reading_questions (
                      exam_id, 
                      passage_number, 
                      section_number, 
                      question_number, 
                      question_text, 
                      question_payload, 
                      correct_answer, 
                      created_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, now())
                """
                cursor.execute(insert_question_query, (
                    EXAM_ID,
                    PASSAGE_NUMBER,
                    section_number,
                    question_number,
                    question_text,
                    Json(question_payload),
                    correct_answer
                ))
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Reading sections and questions loaded successfully.")

if __name__ == "__main__":
    main()
