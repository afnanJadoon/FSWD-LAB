
const students = [
    { id: 101, name: "Ali", completedPrerequisites: ["CS301"] },
    { id: 102, name: "Sara", completedPrerequisites: [] }
];

const courses = [
    { code: "CS401", seats: 1, registeredStudents: [] }
];

function loadStudent(studentId, callback) {
    setTimeout(() => {
        const student = students.find(s => s.id === studentId);

        if (!student) {
            return callback(new Error("Student does not exist."));
        }

        callback(null, student);
    }, 200);
}

function checkPrerequisites(student, courseCode, callback) {
    setTimeout(() => {
        if (!student.completedPrerequisites.includes("CS301")) {
            return callback(new Error("Prerequisite not completed."));
        }

        callback(null, { student, courseCode });
    }, 200);
}

function checkSeats(student, courseCode, callback) {
    setTimeout(() => {
        const course = courses.find(c => c.code === courseCode);

        if (!course) {
            return callback(new Error("Course does not exist."));
        }

        if (course.registeredStudents.includes(student.id)) {
            return callback(new Error("Student already registered."));
        }

        if (course.registeredStudents.length >= course.seats) {
            return callback(new Error("Course is full."));
        }

        callback(null, { student, course });
    }, 200);
}

function registerCourse(student, course, callback) {
    setTimeout(() => {
        if (course.registeredStudents.includes(student.id)) {
            return callback(new Error("Student already registered."));
        }

        course.registeredStudents.push(student.id);

        callback(null, {
            studentId: student.id,
            course: course.code,
            status: "REGISTERED"
        });
    }, 200);
}

function registerStudent(studentId, courseCode) {
    loadStudent(studentId, (error, student) => {
        if (error) {
            console.log("Registration failed:", error.message);
            return;
        }

        checkPrerequisites(student, courseCode, (error, data) => {
            if (error) {
                console.log("Registration failed:", error.message);
                return;
            }

            checkSeats(data.student, data.courseCode, (error, courseData) => {
                if (error) {
                    console.log("Registration failed:", error.message);
                    return;
                }

                registerCourse(
                    courseData.student,
                    courseData.course,
                    (error, confirmation) => {
                        if (error) {
                            console.log("Registration failed:", error.message);
                            return;
                        }

                        console.log("Registration successful:");
                        console.log(confirmation);
                    }
                );
            });
        });
    });
}

registerStudent(101, "CS401");

registerStudent(999, "CS401");

registerStudent(102, "CS401");

setTimeout(() => {
    registerStudent(101, "CS401");
}, 1000);
