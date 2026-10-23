
const http = require("http");
const fs = require("fs");

const file = "student-data.json";

const resources = ["students", "teachers", "attendance", "marks"];

let data = {
    students: [],
    teachers: [],
    attendance: [],
    marks: []
};

if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveData() {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function send(res, status, result) {
    res.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    });
    res.end(JSON.stringify(result));
}

async function readBody(req) {
    let body = "";

    for await (const chunk of req) {
        body += chunk;
    }

    return JSON.parse(body || "{}");
}

const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
        return send(res, 204, {});
    }

    const url = new URL(req.url, "http://localhost:3004");
    const parts = url.pathname.split("/").filter(Boolean);

    const resource = parts[0];
    const id = parts.length === 2 ? Number(parts[1]) : null;

    if (!resources.includes(resource) || parts.length > 2) {
        return send(res, 404, { message: "Endpoint not found" });
    }

    try {
        if (req.method === "GET" && id === null) {
            return send(res, 200, data[resource]);
        }

        if (req.method === "GET" && id !== null) {
            const record = data[resource].find(item => item.id === id);

            if (!record) {
                return send(res, 404, { message: "Record not found" });
            }

            return send(res, 200, record);
        }

        if (req.method === "POST" && id === null) {
            const body = await readBody(req);

            if (!body || typeof body !== "object" || Array.isArray(body)) {
                return send(res, 400, { message: "Invalid data" });
            }

            const required = {
                students: ["name"],
                teachers: ["name"],
                attendance: ["studentId", "date", "status"],
                marks: ["studentId", "subject", "marks"]
            };

            for (const field of required[resource]) {
                if (body[field] === undefined || body[field] === "") {
                    return send(res, 400, {
                        message: field + " is required"
                    });
                }
            }

            const nextId = data[resource].length
                ? Math.max(...data[resource].map(item => item.id)) + 1
                : 1;

            const record = { ...body, id: nextId };

            data[resource].push(record);
            saveData();

            return send(res, 201, record);
        }

        if (req.method === "PUT" && id !== null) {
            const body = await readBody(req);

            const index = data[resource].findIndex(
                item => item.id === id
            );

            if (index === -1) {
                return send(res, 404, { message: "Record not found" });
            }

            data[resource][index] = {
                ...data[resource][index],
                ...body,
                id: id
            };

            saveData();

            return send(res, 200, data[resource][index]);
        }

        if (req.method === "DELETE" && id !== null) {
            const index = data[resource].findIndex(
                item => item.id === id
            );

            if (index === -1) {
                return send(res, 404, { message: "Record not found" });
            }

            const deleted = data[resource].splice(index, 1);

            saveData();

            return send(res, 200, {
                message: "Record deleted",
                record: deleted[0]
            });
        }

        return send(res, 405, { message: "Method not allowed" });

    } catch (error) {
        return send(res, 400, {
            message: "Invalid JSON or request data"
        });
    }
});

server.listen(3004, () => {
    console.log("Student Management API is running");
    console.log("URL: http://localhost:3004");
});
