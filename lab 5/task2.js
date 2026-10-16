
const results = [
    { id: 1, name: "Ali", department: "CS", course: "FSWD", marks: 82 },
    { id: 2, name: "Sara", department: "CS", course: "FSWD", marks: 91 },
    { id: 3, name: "Usman", department: "SE", course: "FSWD", marks: 47 },
    { id: 4, name: "Hina", department: "AI", course: "FSWD", marks: 73 },
    { id: 5, name: "Ahmed", department: "SE", course: "FSWD", marks: 64 },
    { id: 6, name: "Zoya", department: "AI", course: "FSWD", marks: 91 }
];

function calculateGrade(marks) {
    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        return { grade: "Invalid", status: "Invalid", gradePoints: null };
    }

    let grade;
    let gradePoints;

    if (marks >= 85) {
        grade = "A";
        gradePoints = 4.0;
    } else if (marks >= 80) {
        grade = "A-";
        gradePoints = 3.7;
    } else if (marks >= 75) {
        grade = "B+";
        gradePoints = 3.3;
    } else if (marks >= 70) {
        grade = "B";
        gradePoints = 3.0;
    } else if (marks >= 65) {
        grade = "B-";
        gradePoints = 2.7;
    } else if (marks >= 60) {
        grade = "C+";
        gradePoints = 2.3;
    } else if (marks >= 50) {
        grade = "C";
        gradePoints = 2.0;
    } else {
        grade = "F";
        gradePoints = 0;
    }

    return {
        grade,
        status: marks >= 50 ? "Pass" : "Fail",
        gradePoints
    };
}

const processedResults = results.map(student => ({
    ...student,
    ...calculateGrade(student.marks)
}));

const rankedList = [...processedResults].sort((a, b) => {
    if (b.marks !== a.marks) {
        return b.marks - a.marks;
    }
    return a.name.localeCompare(b.name);
});

const departmentStats = processedResults.reduce((stats, student) => {
    if (!stats[student.department]) {
        stats[student.department] = {
            students: 0,
            totalMarks: 0,
            average: 0,
            highest: -Infinity,
            passed: 0
        };
    }

    const department = stats[student.department];

    department.students++;
    department.totalMarks += student.marks;
    department.highest = Math.max(
        department.highest, student.marks
    );

    if (student.status === "Pass") {
        department.passed++;
    }

    department.average = Number(
        (department.totalMarks / department.students).toFixed(2)
    );

    return stats;
}, {});

Object.values(departmentStats).forEach(department => {
    delete department.totalMarks;
});

const firstAbove85 = processedResults.find(
    student => student.marks > 85
);

const firstFailedIndex = processedResults.findIndex(
    student => student.status === "Fail"
);

const anyoneFailed = processedResults.some(
    student => student.status === "Fail"
);

const allMarksValid = processedResults.every(
    student =>
        Number.isFinite(student.marks) &&
        student.marks >= 0 &&
        student.marks <= 100
);

const overallAverage = processedResults.length
    ? processedResults.reduce(
        (sum, student) => sum + student.marks, 0
    ) / processedResults.length
    : 0;

const aboveAverage = processedResults.filter(
    student => student.marks > overallAverage
);

const topThree = rankedList.slice(0, 3).map(
    student => student.name
);

console.log("A. PROCESSED RESULTS");
console.log(processedResults);

console.log("\nB. RANKED LIST");
console.log(rankedList);

console.log("\nC. DEPARTMENT STATISTICS");
console.log(departmentStats);

console.log("\nD. ACADEMIC QUERIES");
console.log({
    firstAbove85,
    firstFailedIndex,
    anyoneFailed,
    allMarksValid,
    overallAverage: Number(overallAverage.toFixed(2)),
    aboveAverage,
    topThree
});

console.log(
    "\nOriginal order unchanged:",
    results.map(s => s.id).join(",") === "1,2,3,4,5,6"
);

console.log("Boundary 50:", calculateGrade(50));
console.log("Boundary 85:", calculateGrade(85));
console.log("Invalid 101:", calculateGrade(101));
