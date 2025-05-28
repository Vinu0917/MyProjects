async function runCode() {
    const code = document.getElementById("codeInput").value;
    const outputEl = document.getElementById("output");
    outputEl.textContent = "Running...";
    console.log("Sending code to backend:", code);

    try {
        const response = await fetch("/run-java", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        if (!response.ok) {
            outputEl.textContent = `Error: Server responded with status ${response.status}`;
            return;
        }

        const result = await response.json();
        console.log("Received response:", result);

        // Helper to decode base64 safely
        function decodeBase64(str) {
            try {
                return atob(str);
            } catch {
                return str; // If not base64, return as is
            }
        }

        if (result.stderr) {
            outputEl.textContent = "Error:\n" + decodeBase64(result.stderr);
        } else if (result.compile_output) {
            outputEl.textContent = "Compile Error:\n" + decodeBase64(result.compile_output);
        } else if (result.stdout) {
            outputEl.textContent = decodeBase64(result.stdout);
        } else {
            outputEl.textContent = "No output.";
        }
    } catch (error) {
        console.error("Fetch or JSON error:", error);
        outputEl.textContent = "An error occurred while running the code.";
    }
}
