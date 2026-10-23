
const http = require("http");
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "data.json");

function readData() {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveData(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function send(res, status, data) {
    res.writeHead(status, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

async function readBody(req) {
    let body = "";

    for await (const chunk of req) {
        body += chunk;
    }

    return JSON.parse(body || "{}");
}

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, "http://localhost:3000");
        const parts = url.pathname.split("/").filter(Boolean);
        const method = req.method;

        if (parts[0] !== "api") {
            return send(res, 404, { message: "Endpoint not found" });
        }

        const section = parts[1];
        const id = parts[2] ? Number(parts[2]) : null;
        const data = readData();

        if (section === "products") {
            if (method === "GET" && id === null) {
                return send(res, 200, data.products);
            }

            if (method === "GET" && id !== null) {
                const product = data.products.find(p => p.id === id);

                if (!product) {
                    return send(res, 404, { message: "Product not found" });
                }

                return send(res, 200, product);
            }

            if (method === "POST" && id === null) {
                const body = await readBody(req);

                if (!body.name || body.price == null) {
                    return send(res, 400, {
                        message: "Name and price are required"
                    });
                }

                const product = {
                    id: Date.now(),
                    name: body.name,
                    price: Number(body.price)
                };

                data.products.push(product);
                saveData(data);

                return send(res, 201, product);
            }

            if (method === "PUT" && id !== null) {
                const product = data.products.find(p => p.id === id);

                if (!product) {
                    return send(res, 404, { message: "Product not found" });
                }

                const body = await readBody(req);

                if (body.name !== undefined) product.name = body.name;
                if (body.price !== undefined) product.price = Number(body.price);

                saveData(data);
                return send(res, 200, product);
            }

            if (method === "DELETE" && id !== null) {
                const oldLength = data.products.length;

                data.products = data.products.filter(p => p.id !== id);

                if (data.products.length === oldLength) {
                    return send(res, 404, { message: "Product not found" });
                }

                saveData(data);
                return send(res, 200, { message: "Product deleted" });
            }
        }

        if (section === "cart") {
            if (method === "GET") {
                return send(res, 200, data.cart);
            }

            if (method === "POST") {
                const body = await readBody(req);

                const product = data.products.find(
                    p => p.id === Number(body.productId)
                );

                if (!product) {
                    return send(res, 404, { message: "Product not found" });
                }

                const item = {
                    id: Date.now(),
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: Number(body.quantity) || 1
                };

                data.cart.push(item);
                saveData(data);

                return send(res, 201, item);
            }

            if (method === "DELETE" && id !== null) {
                const oldLength = data.cart.length;

                data.cart = data.cart.filter(item => item.id !== id);

                if (data.cart.length === oldLength) {
                    return send(res, 404, { message: "Cart item not found" });
                }

                saveData(data);
                return send(res, 200, { message: "Item removed from cart" });
            }
        }

        if (section === "orders") {
            if (method === "GET") {
                return send(res, 200, data.orders);
            }

            if (method === "POST") {
                if (data.cart.length === 0) {
                    return send(res, 400, { message: "Cart is empty" });
                }

                const body = await readBody(req);

                const total = data.cart.reduce(
                    (sum, item) => sum + item.price * item.quantity, 0
                );

                const order = {
                    id: Date.now(),
                    customer: body.customer || "Guest",
                    items: data.cart,
                    total: total
                };

                data.orders.push(order);
                data.cart = [];

                saveData(data);

                return send(res, 201, order);
            }
        }

        if (section === "reviews") {
            if (method === "GET") {
                return send(res, 200, data.reviews);
            }

            if (method === "POST") {
                const body = await readBody(req);

                if (!body.productId || !body.comment) {
                    return send(res, 400, {
                        message: "Product ID and comment are required"
                    });
                }

                const review = {
                    id: Date.now(),
                    productId: Number(body.productId),
                    comment: body.comment,
                    rating: Number(body.rating) || 5
                };

                data.reviews.push(review);
                saveData(data);

                return send(res, 201, review);
            }
        }

        return send(res, 404, { message: "Endpoint not found" });

    } catch (error) {
        return send(res, 400, { message: "Invalid request data" });
    }
});

server.listen(3000, () => {
    console.log("E-commerce API is running");
    console.log("http://localhost:3000");
});
