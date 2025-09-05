import { createRoot } from "react-dom/client"
function App(){
    return(
        <div>
            <img src="images/react-logo.png" width="40px" alt="React Logo"/>
            <h1>Fun facts about React</h1>
             <ul>
                <li>was frirst released in 2013</li>
                <li>was originally created by Jordan Walke</li>
                <li>Has well over 100k stars on GitHub </li>
                <li>Is maintained by Facebook</li>
                <li>Powers thousands of enterprise apps, including mobile apps</li>
            </ul>
        </div>
    )
}
const root = createRoot(document.getElementById("root"))
root.render(<App />)