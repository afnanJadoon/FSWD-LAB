
import Student from "./Student.js";

import {
    calculateAverage,
    calculateGPA,
    calculateGrade as getGrade
} from "./gradeUtils.js";

export function processTranscript(rawData) {
    let data;

    try {
        data = JSON.parse(rawData);
    } catch {
        throw new SyntaxError("Transcript contains malformed JSON.");
    }

    if (!Array.isArray(data)) {
        throw new TypeError("Transcript must contain an array of students.");
    }

    const ids = new Set();

    const report = data.map(item => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            throw new TypeError("Each student must be an object.");
        }

        if (item.id === undefined || item.id === null || item.id === "") {
            throw new TypeError("Student ID is required.");
        }

        if (ids.has(item.id)) {
            throw new Error(`Duplicate student ID: ${item.id}`);
        }
        ids.add(item.id);

        if (typeof item.name !== "string" || item.name.trim() === "") {
            throw new TypeError("Student name is required.");
        }

        if (!Array.isArray(item.courses)) {
            throw new TypeError("Courses must be an array.");
        }

        const courses = item.courses.map(course => {
            if (
                !course ||
                typeof course.code !== "string" ||
                course.code.trim() === ""
            ) {
                throw new TypeError("Course code is required.");
            }

            if (
                typeof course.marks !== "number" ||
                !Number.isFinite(course.marks)
            ) {
                throw new TypeError("Course marks must be a number.");
            }

            if (course.marks < 0 || course.marks > 100) {
                throw new RangeError(
                    `Invalid marks for course ${course.code}.`
                );
            }

            return {
                code: course.code,
                marks: course.marks,
                grade: getGrade(course.marks)
            };
        });

        const student = new Student(item.id, item.name, courses);
        const marks = courses.map(course => course.marks);

        return {
            id: student.id,
            name: student.name,
            courses: student.courses,
            average: marks.length
                ? Number(calculateAverage(marks).toFixed(2))
                : null,
            gpa: marks.length
                ? Number(calculateGPA(marks).toFixed(2))
                : null
        };
    });

    return {
        totalStudents: report.length,
        students: report
    };
}

export function transcriptToJSON(rawData) {
    const report = processTranscript(rawData);
    return JSON.stringify(report, null, 2);
}
