import json
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(dotenv_path=".env.local")

# Fetch connection details
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
EXAM_ID = "4defebd7-9096-4568-b1cf-d843df3a0f66"  
#TODO: Replace with your exam id

def load_answers(json_file):
    with open(json_file, "r", encoding="utf-8") as f:
        return json.load(f)

def main():
    #TODO: Change the exam_id path to the one you want to update
    answers_data = load_answers("exam_data/general/reading/jan_2024/answers.json")  
    
    answers = answers_data.get("answers", {})

    conn = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )
    cursor = conn.cursor()

    # Update each reading question's correct_answer using question_number
    for q_num, correct_ans in answers.items():
        update_query = """
            UPDATE reading_questions
            SET correct_answer = %s
            WHERE exam_id = %s AND question_number = %s
        """
        cursor.execute(update_query, (correct_ans, EXAM_ID, int(q_num)))
    
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Reading answers updated successfully for \n exam_id: {EXAM_ID}")

if __name__ == "__main__":
    main()
