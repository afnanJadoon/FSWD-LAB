import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import * as fs from 'fs';

const file = 'student-data.json';

const resources = ['students', 'teachers', 'attendance', 'marks'];

let data: any = {
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

function checkResource(resource: string) {
  if (!resources.includes(resource)) {
    throw new NotFoundException('Endpoint not found');
  }
}

@Controller(':resource')
export class StudentController {
  @Get()
  getAll(@Param('resource') resource: string) {
    checkResource(resource);
    return data[resource];
  }

  @Get(':id')
  getOne(@Param('resource') resource: string, @Param('id') id: string) {
    checkResource(resource);

    const record = data[resource].find((item) => item.id === Number(id));

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return record;
  }

  @Post()
  create(@Param('resource') resource: string, @Body() body: any) {
    checkResource(resource);

    const required = {
      students: ['name'],
      teachers: ['name'],
      attendance: ['studentId', 'date', 'status'],
      marks: ['studentId', 'subject', 'marks'],
    };

    for (const field of required[resource]) {
      if (body[field] === undefined || body[field] === '') {
        throw new BadRequestException(field + ' is required');
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

  @Put(':id')
  update(
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    checkResource(resource);

    const index = data[resource].findIndex((item) => item.id === Number(id));

    if (index === -1) {
      throw new NotFoundException('Record not found');
    }

    data[resource][index] = {
      ...data[resource][index],
      ...body,
      id: Number(id),
    };

    saveData();

    return data[resource][index];
  }

  @Delete(':id')
  remove(@Param('resource') resource: string, @Param('id') id: string) {
    checkResource(resource);

    const index = data[resource].findIndex((item) => item.id === Number(id));

    if (index === -1) {
      throw new NotFoundException('Record not found');
    }

    const deleted = data[resource].splice(index, 1);

    saveData();

    return { message: 'Record deleted', record: deleted[0] };
  }
}
