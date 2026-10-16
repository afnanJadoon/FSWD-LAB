
export function calculateGrade(marks) {
    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        throw new RangeError("Marks must be between 0 and 100.");
    }

    if (marks >= 85) return "A";
    if (marks >= 80) return "A-";
    if (marks >= 75) return "B+";
    if (marks >= 70) return "B";
    if (marks >= 65) return "B-";
    if (marks >= 60) return "C+";
    if (marks >= 50) return "C";
    return "F";
}

export function calculateAverage(marks) {
    if (!Array.isArray(marks) || marks.length === 0) {
        throw new TypeError("Marks must be a non-empty array.");
    }

    if (!marks.every(Number.isFinite)) {
        throw new TypeError("Every mark must be a number.");
    }

    return marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
}

export function calculateGPA(marks) {
    if (!Array.isArray(marks) || marks.length === 0) {
        throw new TypeError("Marks must be a non-empty array.");
    }

    const points = marks.map(mark => {
        const grade = calculateGrade(mark);

        switch (grade) {
            case "A": return 4.0;
            case "A-": return 3.7;
            case "B+": return 3.3;
            case "B": return 3.0;
            case "B-": return 2.7;
            case "C+": return 2.3;
            case "C": return 2.0;
            default: return 0;
        }
    });

    return points.reduce((sum, point) => sum + point, 0) / points.length;
}
