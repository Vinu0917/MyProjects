import './Card.css'
import profilePic from './assets/profile.jpg'

function Card({ darkMode, onThemeToggle }) {
  return (
    <div className={`card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="theme-toggle-corner" onClick={onThemeToggle}>
        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
      </div>
      
      {/* Rest of your card content remains the same */}
      <img src={profilePic} className="card--image" alt="Profile" />
      <h2>Vinuji Balasooriya</h2>
      <h4>Frontend Developer | Aspiring Game Developer</h4>
      <p className="card--email">balasooriya.vinuji@gmail.com</p>

      <div className="card--buttons">
        <button className="email-btn">
          <i className="fas fa-envelope"></i> Email
        </button>
        <button className="linkedin-btn">
          <i className="fab fa-linkedin"></i> LinkedIn
        </button>
      </div>

      <div className="card--section">
        <h3>About</h3>
        <p>Passionate computer science student with a strong interest in frontend design, full-stack web development, and game creation. Always learning and building.</p>

        <h3>Skills / Focus Areas</h3>
        <ul>
            <li><i className="fab fa-python"></i> Python</li>
            <li><i className="fab fa-js"></i> JavaScript (React)</li>
            <li><i className="fab fa-html5"></i> HTML & CSS</li>
            <li><i className="fab fa-java"></i> Java (Basics)</li>
            <li><i className="fab fa-git-alt"></i> Git & GitHub</li>
            <li><i className="fas fa-paint-brush"></i> UI/UX Design</li>
            <li><i className="fas fa-palette"></i> Graphic Design</li>
        </ul>
      </div>

      <div className="card--footer">
        <a href="https://www.linkedin.com/in/vinuji-balasooriya-93700b333/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="https://www.facebook.com/profile.php?id=61561702864573" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
      </div>
    </div>
  )
}

export default Card;