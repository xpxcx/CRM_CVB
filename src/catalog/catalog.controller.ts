import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('flowers')
  getFlowers() {
    return this.catalog.getFlowers();
  }

  @Get('packaging')
  getPackaging() {
    return this.catalog.getPackaging();
  }
}
