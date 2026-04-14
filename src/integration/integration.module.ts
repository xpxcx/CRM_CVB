import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { OrdersModule } from '../orders/orders.module';
import { ClassmateModule } from '../classmate/classmate.module';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';

@Module({
  imports: [CatalogModule, OrdersModule, ClassmateModule],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}

