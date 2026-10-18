
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    introduce() {
        return `My name is ${this.name} and my email is ${this.email}.`;
    }
}

class Student extends Person {
    constructor(name, email, rollNo, marks) {
        super(name, email);
        this.rollNo = rollNo;
        this.marks = marks;
    }

    introduce() {
        return `${super.introduce()} I am a student. Roll number: ${this.rollNo}.`;
    }

    getResult() {
        return this.marks >= 50 ? "Pass" : "Fail";
    }
}

class FacultyMember extends Person {
    constructor(name, email, employeeId, department) {
        super(name, email);
        this.employeeId = employeeId;
        this.department = department;
    }

    introduce() {
        return `${super.introduce()} I teach in ${this.department}.`;
    }
}

const student1 = new Student("Ali", "ali@university.edu", 101, 82);
const student2 = new Student("Sara", "sara@university.edu", 102, 42);

const faculty1 = new FacultyMember(
    "Dr. Ahmed",
    "ahmed@university.edu",
    "F201",
    "Computer Science"
);

const faculty2 = new FacultyMember(
    "Dr. Hina",
    "hina@university.edu",
    "F202",
    "Artificial Intelligence"
);

const users = [student1, student2, faculty1, faculty2];

users.forEach(user => console.log(user.introduce()));

console.log("\nStudent result:", student1.getResult());
console.log("Student result:", student2.getResult());

console.log("\nType checking:");
console.log(student1 instanceof Student); // true
console.log(student1 instanceof Person); // true
console.log(faculty1 instanceof FacultyMember); // true
console.log(faculty1 instanceof Student); // false

const guest = {
    name: "Dr. Ahmed",
    email: "ahmed@example.com"
};

console.log("\nUsing call():");
console.log(Person.prototype.introduce.call(guest));
const fn = student1.introduce;

console.log("\nDetached method:");
try {
    console.log(fn());
} catch (error) {
    console.log("Detached method error:", error.message);
}

const safeFn = student1.introduce.bind(student1);

console.log("\nBound method:");
console.log(safeFn());
