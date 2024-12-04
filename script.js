document.addEventListener("DOMContentLoaded", function() {
    const studentForm = document.getElementById("studentForm");
    const studentId = document.getElementById("studentId");
    const studentData = document.getElementById("studentData");
    const submitButton = document.getElementById("submitButton");

    studentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = document.getElementById("name").value;
        const rollNo = document.getElementById("rollNo").value;
        const marks1 = parseFloat(document.getElementById("marks1").value);
        const marks2 = parseFloat(document.getElementById("marks2").value);
        const marks3 = parseFloat(document.getElementById("marks3").value);
        const marks4 = parseFloat(document.getElementById("marks4").value);
        
        const percentage = ((marks1 + marks2 + marks3 + marks4) / 400) * 100;

        const student = {
            id: studentId.value,
            name,
            rollNo,
            marks1,
            marks2,
            marks3,
            marks4,
            percentage
        };

        if (student.id) {
            updateStudent(student);
        } else {
            addStudent(student);
        }

        studentForm.reset();
        studentId.value = "";
    });

    function addStudent(student) {
        fetch("/add-student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        .then(response => response.json())
        .then(data => {
            displayStudents();
        });
    }

    function updateStudent(student) {
        fetch("/update-student", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        .then(response => response.json())
        .then(data => {
            displayStudents();
        });
    }

    function deleteStudent(id) {
        fetch(`/delete-student/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            displayStudents();
        });
    }

    function displayStudents() {
        fetch("/get-students")
            .then(response => response.json())
            .then(students => {
                studentData.innerHTML = "";
                students.forEach(student => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${student.name}</td>
                        <td>${student.rollNo}</td>
                        <td>${student.percentage.toFixed(2)}%</td>
                        <td class="actions">
                            <span class="edit" onclick="editStudent(${student.id})">Edit</span>
                            <span class="delete" onclick="deleteStudent(${student.id})">Delete</span>
                        </td>
                    `;
                    studentData.appendChild(row);
                });
            });
    }

    function editStudent(id) {
        fetch(`/get-student/${id}`)
            .then(response => response.json())
            .then(student => {
                document.getElementById("name").value = student.name;
                document.getElementById("rollNo").value = student.rollNo;
                document.getElementById("marks1").value = student.marks1;
                document.getElementById("marks2").value = student.marks2;
                document.getElementById("marks3").value = student.marks3;
                document.getElementById("marks4").value = student.marks4;
                studentId.value = student.id;
                submitButton.innerText = "Update Student";
            });
    }

    displayStudents();
});
