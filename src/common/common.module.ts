import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageVisitCounter } from './entities/page-visit-counter.entity';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PageVisitCounter])],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
