from flask import Flask, request, jsonify, render_template
import requests
import json
import time
import re

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

RAPIDAPI_KEY = "4bbedff877mshd5503dbefec8b12p18fba0jsncf9d24c29d2d"
JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions"

HEADERS = {
    "content-type": "application/json",
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
}

def replace_public_class_name_with_main(java_code):
    # Regex pattern to find 'public class <ClassName>'
    pattern = r'public\s+class\s+(\w+)'
    match = re.search(pattern, java_code)
    if match:
        # Replace class name with Main
        new_code = re.sub(pattern, 'public class Main', java_code)
        return new_code
    else:
        # No public class found, return as-is
        return java_code

@app.route('/')
def playground():
    return render_template('code_playground.html')

@app.route('/run-java', methods=['POST'])
def run_java_code():
    data = request.get_json()
    java_code = data.get("code", "")

    # Replace the public class name with Main before submission
    java_code = replace_public_class_name_with_main(java_code)

    payload = {
        "language_id": 62,  # Java
        "source_code": java_code,
        "stdin": ""
    }

    # Submit code for execution
    try:
        response = requests.post(JUDGE0_URL, headers=HEADERS, data=json.dumps(payload))
        response.raise_for_status()
        token = response.json().get("token")
    except Exception as e:
        return jsonify({"stderr": f"Error submitting code: {str(e)}"})

    # Poll for result (max 10 attempts)
    max_attempts = 10
    attempt = 0
    while attempt < max_attempts:
        try:
            result_response = requests.get(f"{JUDGE0_URL}/{token}", headers=HEADERS)
            result_response.raise_for_status()
            result = result_response.json()

            if result["status"]["description"] != "Processing":
                return jsonify(result)
            time.sleep(1)
            attempt += 1
        except Exception as e:
            return jsonify({"stderr": f"Error fetching result: {str(e)}"})

    return jsonify({"stderr": "Execution timed out."})

if __name__ == "__main__":
    app.run(debug=True)
