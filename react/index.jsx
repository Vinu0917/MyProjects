import { createRoot } from "react-dom/client"
const root = createRoot(document.getElementById("root"))

function Header() {
    return (
        <header className="header">
            <img src="images/react-logo.png" alt="React logo" className="logo"/>
            <nav>
                <ul className="nav-list">
                    <li className="nav-item"> Pricing</li>
                    <li className="nav-item">About</li>
                    <li className="nav-item">Contact</li>
                </ul>
            </nav>
        </header>
    )
}

function MainContent() {
    return (
        <main>
            <h1>Reason I am excited to learn React</h1>
            <ol>
                <li>React is a popular library, so I will be able to fit in with all the coolest devs out there! 😎</li>
                <li>I am more likely to get a job as a front end developer if I know React</li>
            </ol>
        </main>
    )
}

function Footer() {
    return (
        <footer>
            <small>© 2024 Ziroll development. All rights reserved.</small>
        </footer>
    )
}

function Page() {
    return (
        <>
            <Header />
            <MainContent />
            <Footer />
        </>
    )
}

root.render(
    <Page />
)
