
const student = {
    id: 101,
    name: "Ali",
    marks: 0,
    scholarship: false,
    address: {
        city: "Islamabad",
        sector: "F-10"
    },
    contact: {
        email: "ali@university.edu"
    }
};

const update = {
    name: "Ali Khan",
    address: {
        city: "Rawalpindi"
    },
    contact: {
        phone: "03001234567"
    }
};

const { id, name: oldName, marks = 50 } = student;

const {
    address: { city, sector },
    contact: { email }
} = student;

const [firstMark, secondMark = 0] = [85];

function calculateTotal(...numbers) {
    return numbers.reduce((total, number) => total + number, 0);
}

const { scholarship, ...studentWithoutScholarship } = student;

const phoneBeforeUpdate = student.contact?.phone ?? "No phone";

function updateStudent(original, changes) {
    return {
        ...original,
        ...changes,
        address: {
            ...original.address,
            ...(changes.address ?? {})
        },
        contact: {
            ...original.contact,
            ...(changes.contact ?? {})
        }
    };
}

const updatedStudent = updateStudent(student, update);

console.log("Updated student:");
console.log(updatedStudent);

console.log("\nDestructuring:");
console.log({ id, oldName, marks, city, sector, email });
console.log("Array values:", firstMark, secondMark);
console.log("Rest parameter total:", calculateTotal(10, 20, 30));
console.log("Object rest:", studentWithoutScholarship);
console.log("Old phone:", phoneBeforeUpdate);

console.log("\nReference comparisons:");
console.log("Student same?", student === updatedStudent);
console.log("Address same?", student.address === updatedStudent.address);
console.log("Contact same?", student.contact === updatedStudent.contact);

console.log("\nOriginal student:");
console.log(student);

const boundaryUpdate = {
    marks: 0,
    scholarship: false,
    name: ""
};

const boundaryStudent = updateStudent(student, boundaryUpdate);
console.log("\nBoundary values:");
console.log({
    marks: boundaryStudent.marks,
    scholarship: boundaryStudent.scholarship,
    name: boundaryStudent.name
});
