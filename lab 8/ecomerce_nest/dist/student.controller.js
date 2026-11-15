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
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const file = 'student-data.json';
const resources = ['students', 'teachers', 'attendance', 'marks'];
let data = {
    students: [],
    teachers: [],
    attendance: [],
    marks: [],
};
if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
}
function saveData() {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function checkResource(resource) {
    if (!resources.includes(resource)) {
        throw new common_1.NotFoundException('Endpoint not found');
    }
}
let StudentController = class StudentController {
    getAll(resource) {
        checkResource(resource);
        return data[resource];
    }
    getOne(resource, id) {
        checkResource(resource);
        const record = data[resource].find((item) => item.id === Number(id));
        if (!record) {
            throw new common_1.NotFoundException('Record not found');
        }
        return record;
    }
    create(resource, body) {
        checkResource(resource);
        const required = {
            students: ['name'],
            teachers: ['name'],
            attendance: ['studentId', 'date', 'status'],
            marks: ['studentId', 'subject', 'marks'],
        };
        for (const field of required[resource]) {
            if (body[field] === undefined || body[field] === '') {
                throw new common_1.BadRequestException(field + ' is required');
            }
        }
        const nextId = data[resource].length
            ? Math.max(...data[resource].map((item) => item.id)) + 1
            : 1;
        const record = { ...body, id: nextId };
        data[resource].push(record);
        saveData();
        return record;
    }
    update(resource, id, body) {
        checkResource(resource);
        const index = data[resource].findIndex((item) => item.id === Number(id));
        if (index === -1) {
            throw new common_1.NotFoundException('Record not found');
        }
        data[resource][index] = {
            ...data[resource][index],
            ...body,
            id: Number(id),
        };
        saveData();
        return data[resource][index];
    }
    remove(resource, id) {
        checkResource(resource);
        const index = data[resource].findIndex((item) => item.id === Number(id));
        if (index === -1) {
            throw new common_1.NotFoundException('Record not found');
        }
        const deleted = data[resource].splice(index, 1);
        saveData();
        return { message: 'Record deleted', record: deleted[0] };
    }
};
exports.StudentController = StudentController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('resource')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('resource')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('resource')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('resource')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('resource')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "remove", null);
exports.StudentController = StudentController = __decorate([
    (0, common_1.Controller)(':resource')
], StudentController);
//# sourceMappingURL=student.controller.js.map