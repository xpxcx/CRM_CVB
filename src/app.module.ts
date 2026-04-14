import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';
import { HealthController } from './health.controller';
import { ClassmateModule } from './classmate/classmate.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/api-docs*', '/openapi.json*'],
    }),
    CatalogModule,
    OrdersModule,
    ClassmateModule,
    IntegrationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
