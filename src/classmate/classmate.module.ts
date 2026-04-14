import { Module } from '@nestjs/common';
import { ClassmateController } from './classmate.controller';
import { ClassmateService } from './classmate.service';

@Module({
  controllers: [ClassmateController],
  providers: [ClassmateService],
  exports: [ClassmateService],
})
export class ClassmateModule {}

