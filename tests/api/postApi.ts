import { APIRequestContext, expect } from '@playwright/test';

import { WordPressPost } from './types'; 
 
export class PostApi {

  private readonly baseUrl = 'https://dev.emeli.in.ua/wp-json/wp/v2';
  private readonly headers: Record<string, string>;
  constructor(private request: APIRequestContext) {
    const credentials = Buffer.from('admin:Engineer_123').toString('base64');
    this.headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    };
  }
 
  async healthCheck() {
    const response = await this.request.get(`${this.baseUrl}/posts`, {
      headers: this.headers,
    });
    expect(response.status()).toBe(200);
  }
 
  async createPost(data: Partial<WordPressPost>): Promise<{ post: WordPressPost; time: number }> {
    const start = Date.now();
    const response = await this.request.post(`${this.baseUrl}/posts`, {
      headers: this.headers,
      data,
     });
     const time = Date.now() - start;
     expect(response.status()).toBe(201);
     const post = await response.json() as WordPressPost;
     return { post, time };
  }
 
  async updatePost(id: number, data: Partial<WordPressPost>): Promise<{ post: WordPressPost; time: number }> {
    const start = Date.now();
    const response = await this.request.put(`${this.baseUrl}/posts/${id}`, {
      headers: this.headers,
      data,
    });
    const time = Date.now() - start;
    expect(response.status()).toBe(200);
    const post = await response.json() as WordPressPost;
    return { post, time };
  }
 
  async getPost(id: number): Promise<WordPressPost> {
    const response = await this.request.get(`${this.baseUrl}/posts/${id}`, {
      headers: this.headers,
    });

    expect(response.status()).toBe(200);
    return await response.json() as WordPressPost;
  }
 
  async deletePost(id: number): Promise<number> {
    const start = Date.now();
    const response = await this.request.delete(`${this.baseUrl}/posts/${id}?force=true`, {
      headers: this.headers,
    });

    const time = Date.now() - start;
    expect(response.status()).toBe(200);
    return time;
  }
 
  async getNonExistentPost(id: number) { 
    const response = await this.request.get(`${this.baseUrl}/posts/${id}`, {
      headers: this.headers,
    });
    return response.status();
  }
 
  async updateNonExistentPost(id: number) {
    const response = await this.request.put(`${this.baseUrl}/posts/${id}`, {
      headers: this.headers,
      data: { title: 'This should fail', content: 'Failure' }
    });
    return response.status();
  }

  async createInvalidPost() {
    const response = await this.request.post(`${this.baseUrl}/posts`, {
      headers: this.headers,
      data: { content: 'Missing title' }
    });
    return response.status();
  }
}

 