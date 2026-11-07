
// Load saved data
let subjects = JSON.parse(
    localStorage.getItem("subjects")
) || [];

let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || [];

// Set today's date
function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

document.getElementById("attendanceDate").value = getToday();


// Save data
function saveData() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("attendance", JSON.stringify(attendance));
}


// Add Subject
document.getElementById("subjectForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("subjectName").value.trim();

    if (subjects.some(s => s.toLowerCase() === name.toLowerCase())) {
        alert("Subject already exists!");
        return;
    }

    subjects.push(name);

    saveData();

    document.getElementById("subjectName").value = "";

    displaySubjects();

    alert("Subject added successfully!");
});


// Display subjects in dropdown
function displaySubjects() {

    let dropdown = document.getElementById("subjectSelect");

    dropdown.innerHTML = '<option value="">Choose Subject</option>';

    subjects.forEach(function(subject) {

        let option = document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        dropdown.appendChild(option);
    });

    showSubjectReport();
}


// Mark Attendance
document.getElementById("attendanceForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let subject = document.getElementById("subjectSelect").value;
    let date = document.getElementById("attendanceDate").value;
    let status = document.getElementById("attendanceStatus").value;

    if (!subject || !date) {
        alert("Please select subject and date!");
        return;
    }

    // Update existing record or add a new one
    let existing = attendance.find(function(record) {
        return record.subject === subject && record.date === date;
    });

    if (existing) {
        existing.status = status;
        alert("Attendance updated!");
    } else {
        attendance.push({
            subject: subject,
            date: date,
            status: status
        });

        alert("Attendance saved!");
    }

    saveData();

    showSubjectReport();
    showHistory();
    updateDashboard();
});


// Subject-wise Report
function showSubjectReport() {

    let list = document.getElementById("subjectList");

    list.innerHTML = "";

    subjects.forEach(function(subject) {

        let records = attendance.filter(function(record) {
            return record.subject === subject;
        });

        let total = records.length;

        let present = records.filter(function(record) {
            return record.status === "Present";
        }).length;

        let percentage = total === 0 ? 0 : (present / total) * 100;

        let status = percentage >= 75 ? "Safe" : "Below 75%";

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(subject)}</td>
            <td>${total}</td>
            <td>${present}</td>
            <td>${percentage.toFixed(2)}%</td>
            <td class="${percentage >= 75 ? "safe" : "warning"}">
                ${status}
            </td>
        `;

        list.appendChild(row);
    });
}


// Attendance History
function showHistory() {

    let history = document.getElementById("attendanceHistory");

    history.innerHTML = "";

    let records = [...attendance].sort(function(a, b) {
        return b.date.localeCompare(a.date);
    });

    records.forEach(function(record) {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(record.date)}</td>
            <td>${escapeHTML(record.subject)}</td>
            <td class="${record.status === "Present" ? "present" : "absent"}">
                ${record.status}
            </td>
        `;

        history.appendChild(row);
    });
}


// Overall Dashboard
function updateDashboard() {

    let total = attendance.length;

    let present = attendance.filter(function(record) {
        return record.status === "Present";
    }).length;

    let percentage = total === 0 ? 0 : (present / total) * 100;

    document.getElementById("totalClasses").textContent = total;

    document.getElementById("attendedClasses").textContent = present;

    document.getElementById("percentage").textContent =
        percentage.toFixed(2) + "%";
}


// Escape user-provided text before displaying it in HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}


// Load saved records when website opens
displaySubjects();
showHistory();
updateDashboard();
