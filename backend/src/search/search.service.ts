import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as matter from 'gray-matter';
import * as lunr from 'lunr';

@Injectable()
export class SearchService {
  private index: lunr.Index;
  private documents: any[];

  constructor() {
    this.buildIndex();
  }

  private buildIndex() {
    // マークダウンファイルのディレクトリを指定（フロントエンドのcontent/postsディレクトリを指定）
    const postsDirectory = path.join(process.cwd(), '../frontend/content/posts');
    const fileNames = fs.readdirSync(postsDirectory);
  
    this.documents = fileNames.map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const id = fileName.replace(/\.md$/, '');
  
      return {
        id,
        title: matterResult.data.title,
        content: matterResult.content,
      };
    });
  
    const documents = this.documents;

    this.index = lunr(function () {
      this.ref('id');
      this.field('title');
      this.field('content');
    
      documents.forEach((doc) => {
        this.add(doc);
      });
    });
    
    
    
    
  }
  

  public search(query: string) {
    const results = this.index.search(query);
    return results.map((result) => {
      const document = this.documents.find((doc) => doc.id === result.ref);
      return {
        id: document.id,
        title: document.title,
        // date, thumbnail, category が documents に存在しないため、削除
        score: result.score,
      };
    });
  }
  
}
