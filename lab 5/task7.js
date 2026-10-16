
const students = [
    { id: 101, name: "Ali", completedPrerequisites: ["CS301"] },
    { id: 102, name: "Sara", completedPrerequisites: [] }
];

const courses = [
    { code: "CS401", seats: 2, registeredStudents: [] }
];

function getStudent(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const student = students.find(s => s.id === id);

            if (!student) {
                return reject(new Error("Student not found."));
            }

            resolve(student);
        }, 100);
    });
}

function getCourse(code) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const course = courses.find(c => c.code === code);

            if (!course) {
                return reject(new Error("Course not found."));
            }

            resolve(course);
        }, 100);
    });
}

function checkPrerequisites(student) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!student.completedPrerequisites.includes("CS301")) {
                return reject(new Error("Prerequisite not completed."));
            }

            resolve(student);
        }, 100);
    });
}

function checkSeats(course) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (course.registeredStudents.length >= course.seats) {
                return reject(new Error("Course is full."));
            }

            resolve(course);
        }, 100);
    });
}

function registerStudent(student, course) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (course.registeredStudents.includes(student.id)) {
                return reject(new Error("Already registered."));
            }

            course.registeredStudents.push(student.id);

            resolve({
                studentId: student.id,
                course: course.code,
                status: "REGISTERED"
            });
        }, 100);
    });
}

function sendEmail() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Email sent"), 100);
    });
}

function sendSMS() {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("SMS service unavailable")), 150);
    });
}

function writeAuditLog() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Audit log saved"), 50);
    });
}

function runRegistration(studentId, courseCode) {
    let selectedStudent;
    let selectedCourse;

    return getStudent(studentId)
        .then(student => {
            selectedStudent = student;
            return getCourse(courseCode);
        })
        .then(course => {
            selectedCourse = course;
            return checkPrerequisites(selectedStudent);
        })
        .then(() => checkSeats(selectedCourse))
        .then(() => registerStudent(selectedStudent, selectedCourse))
        .then(confirmation => {
            console.log("Registration successful:", confirmation);
            return confirmation;
        })
        .catch(error => {
            console.log("Registration failed:", error.message);
            throw error;
        })
        .finally(() => {
            console.log("Registration workflow finished.");
        });
}

function runPostRegistrationServices() {
    return Promise.allSettled([
        sendEmail(),
        sendSMS(),
        writeAuditLog()
    ]).then(results => {
        const names = ["Email", "SMS", "Audit"];

        const report = results.map((result, index) => ({
            service: names[index],
            status: result.status
        }));

        console.log("Post-registration report:");
        console.log(report);

        return report;
    });
}

function getCourseFromServer(serverName, delay, shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`${serverName} failed`));
            } else {
                resolve({
                    server: serverName,
                    course: "CS401"
                });
            }
        }, delay);
    });
}

function getCourseFromAnyServer() {
    return Promise.any([
        getCourseFromServer("Server A", 100, true),
        getCourseFromServer("Server B", 200, false)
    ]);
}

runRegistration(101, "CS401")
    .then(() => runPostRegistrationServices())
    .then(() => getCourseFromAnyServer())
    .then(result => {
        console.log("First successful server:", result);
    })
    .catch(error => {
        console.log("Final error:", error.message);
    });

runRegistration(999, "CS401").catch(() => {});
