import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';
import { HealthController } from './health.controller';

@Module({
  imports: [CatalogModule, OrdersModule],
  controllers: [HealthController],
})
export class AppModule {}
