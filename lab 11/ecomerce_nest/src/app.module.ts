import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { StudentController } from './student.controller';

// ShopController must be first, because StudentController has a ":resource" route
@Module({
  controllers: [ShopController, StudentController],
})
export class AppModule {}
