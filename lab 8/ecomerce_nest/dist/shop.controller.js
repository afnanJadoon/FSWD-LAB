"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), 'data.json');
function readData() {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function saveData(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
let ShopController = class ShopController {
    getProducts() {
        return readData().products;
    }
    getProduct(id) {
        const product = readData().products.find((p) => p.id === Number(id));
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    addProduct(body) {
        const data = readData();
        if (!body.name || body.price == null) {
            throw new common_1.BadRequestException('Name and price are required');
        }
        const product = {
            id: Date.now(),
            name: body.name,
            price: Number(body.price),
        };
        data.products.push(product);
        saveData(data);
        return product;
    }
    updateProduct(id, body) {
        const data = readData();
        const product = data.products.find((p) => p.id === Number(id));
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (body.name !== undefined)
            product.name = body.name;
        if (body.price !== undefined)
            product.price = Number(body.price);
        saveData(data);
        return product;
    }
    deleteProduct(id) {
        const data = readData();
        const oldLength = data.products.length;
        data.products = data.products.filter((p) => p.id !== Number(id));
        if (data.products.length === oldLength) {
            throw new common_1.NotFoundException('Product not found');
        }
        saveData(data);
        return { message: 'Product deleted' };
    }
    getCart() {
        return readData().cart;
    }
    addToCart(body) {
        const data = readData();
        const product = data.products.find((p) => p.id === Number(body.productId));
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const item = {
            id: Date.now(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: Number(body.quantity) || 1,
        };
        data.cart.push(item);
        saveData(data);
        return item;
    }
    removeFromCart(id) {
        const data = readData();
        const oldLength = data.cart.length;
        data.cart = data.cart.filter((item) => item.id !== Number(id));
        if (data.cart.length === oldLength) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        saveData(data);
        return { message: 'Item removed from cart' };
    }
    getOrders() {
        return readData().orders;
    }
    placeOrder(body) {
        const data = readData();
        if (data.cart.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const total = data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = {
            id: Date.now(),
            customer: body.customer || 'Guest',
            items: data.cart,
            total: total,
        };
        data.orders.push(order);
        data.cart = [];
        saveData(data);
        return order;
    }
    getReviews() {
        return readData().reviews;
    }
    addReview(body) {
        const data = readData();
        if (!body.productId || !body.comment) {
            throw new common_1.BadRequestException('Product ID and comment are required');
        }
        const review = {
            id: Date.now(),
            productId: Number(body.productId),
            comment: body.comment,
            rating: Number(body.rating) || 5,
        };
        data.reviews.push(review);
        saveData(data);
        return review;
    }
};
exports.ShopController = ShopController;
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('cart'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('cart'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Delete)('cart/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "removeFromCart", null);
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Get)('reviews'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Post)('reviews'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "addReview", null);
exports.ShopController = ShopController = __decorate([
    (0, common_1.Controller)('api')
], ShopController);
//# sourceMappingURL=shop.controller.js.map