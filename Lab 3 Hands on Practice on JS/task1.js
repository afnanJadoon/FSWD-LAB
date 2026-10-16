var name = "Muhammad Afnan Jadoon";
var rollNo = 241873;
var age = 20;
var hobby = "Football";
var ethnicity = "Pathan";

var obj = {
    name: name,
    age: age,
    hobby: hobby,
    ethnicity: ethnicity,

    address: {
        add: "Mangu town, barakho"
    },

    degree: {
        degree: "BSCS",
        university: "Air University"
    },

    education: {
        school: "IMSB",
        college: "PGC"
    }
};

console.log("MY name is " + obj.name);
console.log("My age is " + obj.age);
console.log("My hobby is " + obj.hobby);
console.log("My ethnicity is " + obj.ethnicity);
console.log("My address is " + obj.address.add);
console.log("My degree is " + obj.degree.degree);
console.log("My university is " + obj.degree.university);
console.log("My school was " + obj.education.school);
console.log("My college was " + obj.education.college);