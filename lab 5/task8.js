
const usersData = [
    { id: 1, name: "Ali", department: "CS" },
    { id: 2, name: "Sara", department: "CS" },
    { id: 3, name: "Usman", department: "SE" }
];

const coursesData = [
    { code: "CS301", name: "JavaScript" },
    { code: "CS302", name: "Networking" }
];

const resultsData = [
    { studentId: 1, name: "Ali", department: "CS", marks: 82 },
    { studentId: 2, name: "Sara", department: "CS", marks: 91 },
    { studentId: 3, name: "Usman", department: "SE", marks: 42 }
];

const apiResponses = {
    "/users": { status: 200, data: usersData },
    "/courses": { status: 200, data: coursesData },
    "/results": { status: 200, data: resultsData },
    "/not-found": { status: 404, data: { message: "Not found" } },
    "/server-error": { status: 500, data: { message: "Server error" } },
    "/invalid-json": { status: 200, data: "not valid JSON" },
    "/slow": { status: 200, data: { message: "Slow response" }, delay: 1000 },
    "/network-error": { networkError: true }
};

function fakeFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const responseData = apiResponses[url];

        const signal = options.signal;

        if (signal?.aborted) {
            return reject(new Error("Request aborted."));
        }

        if (!responseData) {
            return resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: "Not found" })
            });
        }

        let timer;

        const cleanup = () => {
            clearTimeout(timer);
            signal?.removeEventListener("abort", handleAbort);
        };

        const handleAbort = () => {
            cleanup();
            reject(new Error("Request aborted."));
        };

        signal?.addEventListener("abort", handleAbort, { once: true });

        timer = setTimeout(() => {
            if (signal?.aborted) {
                return handleAbort();
            }

            cleanup();

            if (responseData.networkError) {
                return reject(new TypeError("Network request failed."));
            }

            resolve({
                ok: responseData.status >= 200 &&
                    responseData.status < 300,
                status: responseData.status,

                json: async () => {
                    if (url === "/invalid-json") {
                        throw new SyntaxError("Invalid JSON.");
                    }

                    return responseData.data;
                }
            });
        }, responseData.delay ?? 100);
    });
}

async function getJSON(url, fetchImplementation = fakeFetch) {
    const response = await fetchImplementation(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

function createDashboard(users, courses, results) {
    const totalStudents = users.length;
    const totalCourses = courses.length;

    const overallAverage = results.length
        ? results.reduce((sum, student) => sum + student.marks, 0)
            / results.length
        : null;

    const highestPerformingStudent = results.length
        ? [...results].sort((a, b) => b.marks - a.marks)[0]
        : null;

    const failedStudents = results.filter(
        student => student.marks < 50
    ).length;

    const departmentStats = results.reduce((stats, student) => {
        if (!stats[student.department]) {
            stats[student.department] = {
                students: 0,
                totalMarks: 0,
                average: 0,
                passed: 0,
                failed: 0
            };
        }

        const department = stats[student.department];

        department.students++;
        department.totalMarks += student.marks;

        if (student.marks >= 50) {
            department.passed++;
        } else {
            department.failed++;
        }

        department.average = Number(
            (department.totalMarks / department.students).toFixed(2)
        );

        return stats;
    }, {});

    Object.values(departmentStats).forEach(department => {
        delete department.totalMarks;
    });

    return {
        totalStudents,
        totalCourses,
        overallAverage: overallAverage === null
            ? null
            : Number(overallAverage.toFixed(2)),
        highestPerformingStudent,
        failedStudents,
        departmentStats
    };
}

async function loadDashboard() {
    try {
        const [users, courses, results] = await Promise.all([
            getJSON("/users"),
            getJSON("/courses"),
            getJSON("/results")
        ]);

        const dashboard = createDashboard(users, courses, results);

        console.log("DASHBOARD REPORT");
        console.log(dashboard);

        return dashboard;
    } catch (error) {
        console.log("Dashboard error:", error.message);
        throw error;
    } finally {
        console.log("Dashboard loading finished.");
    }
}

async function fetchWithTimeout(url, milliseconds) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, milliseconds);

    try {
        return await getJSON(url, (requestUrl) =>
            fakeFetch(requestUrl, { signal: controller.signal })
        );
    } catch (error) {
        if (controller.signal.aborted) {
            throw new Error(`Request timed out: ${url}`);
        }

        throw error;
    } finally {
        clearTimeout(timer);
    }
}

loadDashboard().catch(() => {});

getJSON("/not-found")
    .catch(error => console.log("404 test:", error.message));

getJSON("/server-error")
    .catch(error => console.log("500 test:", error.message));

getJSON("/network-error")
    .catch(error => console.log("Network test:", error.message));

getJSON("/invalid-json")
    .catch(error => console.log("JSON test:", error.message));

fetchWithTimeout("/slow", 100)
    .then(data => console.log("Slow response:", data))
    .catch(error => console.log("Timeout test:", error.message));

fetchWithTimeout("/users", 1000)
    .then(data => console.log("Successful request:", data))
    .catch(error => console.log("Request error:", error.message));