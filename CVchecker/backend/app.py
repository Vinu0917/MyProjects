from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Change this line to use the correct path to your frontend folder
app = Flask(__name__, static_folder='../frontend', static_url_path='/')

# Create upload folder if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Download NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# Common skills list (simplified)
COMMON_SKILLS = [
    'python', 'java', 'javascript', 'html', 'css', 'react', 'angular', 'vue', 
    'node.js', 'express', 'django', 'flask', 'sql', 'mysql', 'postgresql', 
    'mongodb', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github',
    'machine learning', 'data analysis', 'data science', 'tensorflow', 'pytorch',
    'nlp', 'computer vision', 'agile', 'scrum', 'project management', 'leadership'
]

# Common buzzwords to avoid
BUZZWORDS = [
    'team player', 'detail-oriented', 'hard worker', 'self-starter', 'go-getter',
    'think outside the box', 'results-driven', 'proactive', 'synergy', 'dynamic',
    'best of breed', 'go-to person', 'strategic thinker', 'value add'
]

@app.route('/')
def index():
    return app.send_static_file('index.html')

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_text_from_file(file_path):
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif file_ext in ['.docx', '.doc']:
        return extract_text_from_docx(file_path)
    elif file_ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    return ""

def extract_skills(text):
    text = text.lower()
    found_skills = []
    
    for skill in COMMON_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text):
            found_skills.append(skill.title())  # Capitalize for display
    
    return found_skills

def find_buzzwords(text):
    text = text.lower()
    found_buzzwords = []
    
    for buzzword in BUZZWORDS:
        if re.search(r'\b' + re.escape(buzzword) + r'\b', text):
            found_buzzwords.append(buzzword.title())  # Capitalize for display
    
    return found_buzzwords

def check_ats_issues(cv_text):
    issues = []
    
    # Check for common ATS issues
    if len(cv_text) < 300:
        issues.append("CV content appears too short or not properly extracted")
    
    if not re.search(r'\b(education|qualification|degree|university|college)\b', cv_text, re.IGNORECASE):
        issues.append("Education section might be missing or not clearly labeled")
    
    if not re.search(r'\b(experience|work|employment|job|position)\b', cv_text, re.IGNORECASE):
        issues.append("Work experience section might be missing or not clearly labeled")
    
    if not re.search(r'\b(skill|proficiency|expertise|competency)\b', cv_text, re.IGNORECASE):
        issues.append("Skills section might be missing or not clearly labeled")
    
    # Check for dates in experience
    if not re.search(r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|20\d\d)\b', cv_text, re.IGNORECASE):
        issues.append("Dates might be missing from experience or education sections")
    
    return issues

def generate_improvement_suggestions(cv_text):
    suggestions = []
    
    # Look for weak phrases
    weak_phrases = [
        (r'\bworked on\b', "Worked on customer service.", "Resolved 50+ customer inquiries weekly with a 95% satisfaction rate."),
        (r'\bhelped with\b', "Helped with data analysis.", "Analyzed 2TB of customer data to identify key trends, resulting in 15% revenue growth."),
        (r'\bresponsible for\b', "Responsible for managing team projects.", "Led cross-functional team of 8 members to deliver 3 high-priority projects ahead of schedule."),
        (r'\bparticipated in\b', "Participated in marketing campaigns.", "Contributed key content to 5 marketing campaigns that increased user engagement by 27%."),
    ]
    
    for pattern, example_original, example_improved in weak_phrases:
        if re.search(pattern, cv_text, re.IGNORECASE):
            suggestions.append({
                "original": example_original,
                "improved": example_improved
            })
    
    return suggestions[:3]  # Limit to 3 suggestions

def recommend_courses(missing_skills):
    courses = []
    
    # Mock course recommendations based on missing skills
    course_database = {
        'python': {'name': 'Python for Beginners', 'provider': 'Coursera', 'url': 'https://coursera.org'},
        'java': {'name': 'Java Programming Masterclass', 'provider': 'Udemy', 'url': 'https://udemy.com'},
        'javascript': {'name': 'Modern JavaScript', 'provider': 'freeCodeCamp', 'url': 'https://freecodecamp.org'},
        'react': {'name': 'React - The Complete Guide', 'provider': 'Udemy', 'url': 'https://udemy.com'},
        'tensorflow': {'name': 'TensorFlow for Beginners', 'provider': 'Coursera', 'url': 'https://coursera.org'},
        'kubernetes': {'name': 'Kubernetes Essentials', 'provider': 'LinkedIn Learning', 'url': 'https://linkedin.com/learning'},
        'aws': {'name': 'AWS Certified Solutions Architect', 'provider': 'A Cloud Guru', 'url': 'https://acloudguru.com'},
        'data analysis': {'name': 'Data Analysis with Python', 'provider': 'edX', 'url': 'https://edx.org'},
    }
    
    for skill in missing_skills:
        skill_lower = skill.lower()
        if skill_lower in course_database:
            courses.append(course_database[skill_lower])
    
    return courses[:2]  # Limit to 2 course recommendations

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'cv' not in request.files:
        return jsonify({'error': 'No CV file provided'}), 400
    
    cv_file = request.files['cv']
    
    # Check if job description is provided as file or text
    job_text = ""
    if 'job_file' in request.files:
        job_file = request.files['job_file']
        if job_file.filename:
            job_filename = secure_filename(job_file.filename)
            job_path = os.path.join(app.config['UPLOAD_FOLDER'], job_filename)
            job_file.save(job_path)
            job_text = extract_text_from_file(job_path)
    elif 'job_text' in request.form:
        job_text = request.form['job_text']
    
    if not job_text:
        return jsonify({'error': 'No job description provided'}), 400
    
    # Save and process CV
    if cv_file.filename:
        cv_filename = secure_filename(cv_file.filename)
        cv_path = os.path.join(app.config['UPLOAD_FOLDER'], cv_filename)
        cv_file.save(cv_path)
        cv_text = extract_text_from_file(cv_path)
        
        # Extract skills from both documents
        cv_skills = extract_skills(cv_text)
        job_skills = extract_skills(job_text)
        
        # Find matching and missing skills
        matching_skills = [skill for skill in cv_skills if skill in job_skills]
        missing_skills = [skill for skill in job_skills if skill not in cv_skills]
        
        # Calculate match score
        if len(job_skills) > 0:
            match_score = int((len(matching_skills) / len(job_skills)) * 100)
        else:
            match_score = 0
        
        # Find buzzwords
        buzzwords = find_buzzwords(cv_text)
        
        # Check ATS compatibility
        ats_issues = check_ats_issues(cv_text)
        
        # Generate improvement suggestions
        suggestions = generate_improvement_suggestions(cv_text)
        
        # Recommend courses for missing skills
        courses = recommend_courses(missing_skills)
        
        # Return analysis results
        return jsonify({
            'fitScore': match_score,
            'matchingSkills': matching_skills,
            'missingSkills': missing_skills,
            'overusedBuzzwords': buzzwords,
            'atsIssues': ats_issues,
            'improvementSuggestions': suggestions,
            'courses': courses
        })
    
    return jsonify({'error': 'Invalid CV file'}), 400

# Add this near the bottom of your app.py file
# At the bottom of your file, change the port to 8080
if __name__ == '__main__':
    print("Starting HireLens server...")
    print("Once running, access the application at: http://127.0.0.1:8080")
    print("Press CTRL+C to stop the server")
    app.run(debug=True, host='127.0.0.1', port=8080)