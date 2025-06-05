# Test info

- Name: WordPress Post Lifecycle (create → update → get → delete)
- Location: /Users/natali/Desktop/Projects/apitest/tests/crud.spec.ts:5:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 201
    at /Users/natali/Desktop/Projects/apitest/tests/crud.spec.ts:47:45
    at /Users/natali/Desktop/Projects/apitest/tests/crud.spec.ts:44:3
```

# Test source

```ts
   1 | import { test, expect, request } from '@playwright/test';
   2 | import { PostApi } from './api/postApi';
   3 | import { WordPressPost } from './api/types';
   4 |
   5 | test('WordPress Post Lifecycle (create → update → get → delete)', async ({ request }) => {
   6 |   const wpApi = new PostApi(request);
   7 |   let createdPost: WordPressPost;
   8 |   let postId: number;
   9 |  
   10 |   await test.step('Health Check', async () => {
   11 |     await wpApi.healthCheck();
   12 |   });
   13 |  
   14 |   await test.step('Create Post', async () => {
   15 |     const { post } = await wpApi.createPost({
   16 |       title: 'Initial Test Title',
   17 |       content: 'Initial Test Content',
   18 |       status: 'publish'
   19 |     });
   20 |     createdPost = post;
   21 |     postId = post.id;
   22 |     expect(post.title.rendered).toBe('Initial Test Title');
   23 |   });
   24 |  
   25 |   await test.step('Update Post', async () => {
   26 |     const { post } = await wpApi.updatePost(postId, {
   27 |       title: 'Updated Test Title',
   28 |       content: 'Updated Test Content'
   29 |     });
   30 |     expect(post.title.rendered).toBe('Updated Test Title');
   31 |   });
   32 |  
   33 |   await test.step('Get Post', async () => {
   34 |     const post = await wpApi.getPost(postId);
   35 |     expect(post.id).toBe(postId);
   36 |     expect(post.title.rendered).toBe('Updated Test Title');
   37 |   });
   38 |  
   39 |   await test.step('Delete Post', async () => {
   40 |     const time = await wpApi.deletePost(postId);
   41 |     console.log(`Post deleted in ${time} ms`);
   42 |   });
   43 |  
   44 |   await test.step('Negative cases (404, 400)', async () => {
   45 |     expect(await wpApi.getNonExistentPost(postId)).toBe(404);
   46 |     expect(await wpApi.updateNonExistentPost(postId)).toBe(404);
>  47 |     expect(await wpApi.createInvalidPost()).toBe(400);
      |                                             ^ Error: expect(received).toBe(expected) // Object.is equality
   48 |   });
   49 | });
   50 |
   51 |
   52 |
   53 |
   54 |
   55 |
   56 | // test.describe('WordPress Post Lifecycle', () => {
   57 | //   let apiContext;
   58 | //   let wpApi: PostApi;
   59 | //   let createdPost: WordPressPost;
   60 | //   let responseTime: number;
   61 |  
   62 | //   test.beforeAll(async ({ playwright }) => {
   63 | //     apiContext = await request.newContext();
   64 | //     wpApi = new PostApi(apiContext);
   65 |
   66 | //   });
   67 |  
   68 | //   test.afterAll(async () => {
   69 | //     await apiContext.dispose();
   70 | //   });
   71 |  
   72 | //   test('Health Check', async () => {
   73 | //     await wpApi.healthCheck();
   74 | //   });
   75 |  
   76 | //   test('Create Post', async () => {
   77 | //     const { post, time } = await wpApi.createPost({
   78 | //       title: 'Initial Test Title',
   79 | //       content: 'Initial Test Content',
   80 | //       status: 'publish'
   81 | //     });
   82 | //     createdPost = post;
   83 | //     responseTime = time;
   84 |  
   85 | //     expect(createdPost).toBeDefined();
   86 | //     expect(createdPost.title.rendered).toBe('Initial Test Title');
   87 | //     console.log(`Post created in ${responseTime} ms`);
   88 | //   });
   89 |  
   90 | //   test('Update Post', async () => {
   91 | //     const { post, time } = await wpApi.updatePost(createdPost.id, {
   92 | //       title: 'Updated Test Title',
   93 | //       content: 'Updated Test Content'
   94 | //     });
   95 |  
   96 | //     expect(post.title.rendered).toBe('Updated Test Title');
   97 | //     console.log(`Post updated in ${time} ms`);
   98 | //   });
   99 |  
  100 | //   test('Get Post', async () => {
  101 | //     const post = await wpApi.getPost(createdPost.id);
  102 | //     expect(post.id).toBe(createdPost.id);
  103 | //     expect(post.title.rendered).toBe('Updated Test Title');
  104 | //   });
  105 |  
  106 | //   test('Delete Post', async () => {
  107 | //     const time = await wpApi.deletePost(createdPost.id);
  108 | //     console.log(`Post deleted in ${time} ms`);
  109 | //   });
  110 |  
  111 | //   test('Get Non-existent Post returns 404', async () => {
  112 | //     const status = await wpApi.getNonExistentPost(createdPost.id);
  113 | //     expect(status).toBe(404);
  114 | //   });
  115 |  
  116 | //   test('Update Non-existent Post returns 404', async () => {
  117 | //     const status = await wpApi.updateNonExistentPost(createdPost.id);
  118 | //     expect(status).toBe(404);
  119 | //   });
  120 |  
  121 | //   test('Create Invalid Post returns 400', async () => {
  122 | //     const status = await wpApi.createInvalidPost();
  123 | //     expect(status).toBe(400);
  124 | //   });
  125 | // });
```