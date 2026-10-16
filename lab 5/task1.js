
const applicants = [
    {
        id: "A101",
        name: "Sara Khan",
        age: "19",
        matricMarks: "91",
        intermediateMarks: "87",
        entryTest: "78",
        program: "BSCS",
        feePaid: "true"
    },
    {
        id: "A102",
        name: "Ahmed Ali",
        age: "twenty",
        matricMarks: "88",
        intermediateMarks: "",
        entryTest: "72",
        program: "BSSE",
        feePaid: "false"
    },
    {
        id: "A103",
        name: "Hassan",
        age: "18",
        matricMarks: "76",
        intermediateMarks: "83",
        entryTest: "91",
        program: "BSAI",
        feePaid: "true"
    }
];

const supportedPrograms = ["BSCS", "BSSE", "BSAI"];

function processApplicant(applicant) {
    const age = Number(applicant.age);
    const matric = Number(applicant.matricMarks);
    const intermediate = Number(applicant.intermediateMarks);
    const entryTest = Number(applicant.entryTest);

    const missing = [];
    const invalid = [];

    const requiredFields = [
        "id", "name", "age", "matricMarks",
        "intermediateMarks", "entryTest", "program", "feePaid"
    ];

    requiredFields.forEach(field => {
        if (
            applicant[field] === undefined ||
            applicant[field] === null ||
            String(applicant[field]).trim() === ""
        ) {
            missing.push(field);
        }
    });

    const numericFields = [
        ["age", age],
        ["matricMarks", matric],
        ["intermediateMarks", intermediate],
        ["entryTest", entryTest]
    ];

    numericFields.forEach(([field, value]) => {
        if (
            applicant[field] !== undefined &&
            applicant[field] !== null &&
            String(applicant[field]).trim() !== "" &&
            !Number.isFinite(value)
        ) {
            invalid.push(field);
        }
    });

    if (!Number.isFinite(age) && !missing.includes("age")) {
        if (!invalid.includes("age")) invalid.push("age");
    }

    if (Number.isFinite(matric) && (matric < 0 || matric > 100)) {
        invalid.push("matricMarks");
    }

    if (
        Number.isFinite(intermediate) &&
        (intermediate < 0 || intermediate > 100)
    ) {
        invalid.push("intermediateMarks");
    }

    if (
        Number.isFinite(entryTest) &&
        (entryTest < 0 || entryTest > 100)
    ) {
        invalid.push("entryTest");
    }

    if (Number.isFinite(age) && (age < 17 || age > 30)) {
        invalid.push("age");
    }

    if (!supportedPrograms.includes(applicant.program)) {
        invalid.push("program");
    }

    if (!["true", "false"].includes(applicant.feePaid)) {
        invalid.push("feePaid");
    }
    
    if (missing.length > 0 || invalid.length > 0) {
        return {
            id: applicant.id ?? "Unknown",
            name: applicant.name ?? "Unknown",
            status: "INVALID DATA",
            missingFields: [...new Set(missing)],
            invalidFields: [...new Set(invalid)]
        };
    }

    const merit =
        matric * 0.20 +
        intermediate * 0.30 +
        entryTest * 0.50;

    const eligible =
        merit >= 70 &&
        entryTest >= 60 &&
        intermediate >= 60;

    let status;

    if (!eligible) {
        status = "REJECTED";
    } else if (applicant.feePaid === "true" && merit >= 80) {
        status = "SELECTED";
    } else {
        status = "WAITING";
    }

    return {
        id: applicant.id,
        name: applicant.name,
        program: applicant.program,
        age,
        matricMarks: matric,
        intermediateMarks: intermediate,
        entryTest,
        feePaid: applicant.feePaid === "true",
        merit: Number(merit.toFixed(2)),
        status,
        missingFields: [],
        invalidFields: []
    };
}

const processed = applicants.map(processApplicant);

const validApplicants = processed.filter(
    applicant => applicant.status !== "INVALID DATA"
);

const invalidApplicants = processed.filter(
    applicant => applicant.status === "INVALID DATA"
);

const meritList = [...validApplicants].sort(
    (a, b) => b.merit - a.merit
);

const programCounts = {
    BSCS: 0,
    BSSE: 0,
    BSAI: 0
};

validApplicants.forEach(applicant => {
    switch (applicant.program) {
        case "BSCS":
            programCounts.BSCS++;
            break;
        case "BSSE":
            programCounts.BSSE++;
            break;
        case "BSAI":
            programCounts.BSAI++;
            break;
    }
});

const totalMerit = validApplicants.reduce(
    (sum, applicant) => sum + applicant.merit, 0
);

const summary = {
    validApplicants: validApplicants.length,
    invalidApplicants: invalidApplicants.length,
    highestMeritApplicant: meritList[0] ?? null,
    lowestMerit: meritList.length
        ? meritList[meritList.length - 1].merit
        : null,
    averageMerit: validApplicants.length
        ? Number((totalMerit / validApplicants.length).toFixed(2))
        : null,
    programCounts
};

console.log("PROCESSED APPLICANTS");
console.log(processed);

console.log("\nFINAL SUMMARY");
console.log(summary);
