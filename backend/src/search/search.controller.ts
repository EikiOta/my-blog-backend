import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('query') query: string) {
    console.log('Search query:', query);
    const results = await this.searchService.search(query);
    console.log('Search results:', results); // 検索結果をログに出力
    return results;
  }
}
