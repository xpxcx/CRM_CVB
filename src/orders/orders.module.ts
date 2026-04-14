import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { BouquetCalculatorService } from './bouquet-calculator.service';
import { DeliveryQuoteService } from './delivery-quote.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [CatalogModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    BouquetCalculatorService,
    DeliveryQuoteService,
  ],
})
export class OrdersModule {}
