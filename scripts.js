// Display the section by hiding all others and showing the desired section
function displaySection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('d-none');
    });

    // Show the selected section
    const sectionToDisplay = document.getElementById(sectionId);
    sectionToDisplay.classList.remove('d-none');
}
document.getElementById("questionForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userQuestion = document.getElementById("user_question").value.trim();

    if (!userQuestion) {
        document.getElementById("response").innerText = "Please enter a question.";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userQuestion }),
        });

        const data = await response.json();

        // ✅ Check if `data` is an object (not an array)
        if (data.solution) {
            document.getElementById("response").innerHTML = `
                <b>Solution:</b> ${data.solution} <br>
                <b>Real Time Example:</b> ${data.Real_Time_Example || "N/A"} <br>
                <b>Severity Level:</b> ${data.severity_level}
            `;
        } else {
            document.getElementById("response").innerHTML = "No solution found.";
        }

        document.getElementById("responseContainer").style.display = "block";
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("response").innerText = "Error retrieving data.";
    }
});
