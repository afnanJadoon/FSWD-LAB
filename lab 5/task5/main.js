
import Student from "./Student.js";

import {
    calculateAverage,
    calculateGrade as gradeForMarks
} from "./gradeUtils.js";

import { processTranscript, transcriptToJSON } from "./transcriptService.js";

const rawData = `
[
    {
        "id": 101,
        "name": "Ali",
        "courses": [
            { "code": "CS301", "marks": 81 },
            { "code": "CS302", "marks": 74 }
        ]
    }
]
`;

try {
    const report = processTranscript(rawData);

    console.log("Transcript report:");
    console.log(report);

    console.log("\nJSON report:");
    console.log(transcriptToJSON(rawData));

    console.log("\nGrade test:", gradeForMarks(81));
    console.log("Average test:", calculateAverage([81, 74]));

    const exampleStudent = new Student(102, "Sara", []);
    console.log("Default class import:", exampleStudent);
} catch (error) {
    console.log(`${error.name}: ${error.message}`);
} finally {
    console.log("Transcript processing finished.");
}

try {
    processTranscript("{ invalid JSON }");
} catch (error) {
    console.log("Invalid JSON test:", error.name, error.message);
}

try {
    processTranscript(`
    [
        {"id": 1, "name": "Ali", "courses": []},
        {"id": 1, "name": "Sara", "courses": []}
    ]
    `);
} catch (error) {
    console.log("Duplicate ID test:", error.name, error.message);
}

try {
    processTranscript(`
    [
        {
            "id": 3,
            "name": "Usman",
            "courses": [{"code": "CS301", "marks": 110}]
        }
    ]
    `);
} catch (error) {
    console.log("Invalid marks test:", error.name, error.message);
}
