import { test, expect, request } from '@playwright/test';
import { PostApi } from './api/postApi';
import { WordPressPost } from './api/types';

test('WordPress Post Lifecycle (create → update → get → delete)', async ({ request }) => {
  const wpApi = new PostApi(request);
  let createdPost: WordPressPost;
  let postId: number;
 
  await test.step('Health Check', async () => {
    await wpApi.healthCheck();
  });
 
  await test.step('Create Post', async () => {
    const { post } = await wpApi.createPost({
      title: 'Initial Test Title',
      content: 'Initial Test Content',
      status: 'publish'
    });
    createdPost = post;
    postId = post.id;
    expect(post.title.rendered).toBe('Initial Test Title');
  });
 
  await test.step('Update Post', async () => {
    const { post } = await wpApi.updatePost(postId, {
      title: 'Updated Test Title',
      content: 'Updated Test Content'
    });
    expect(post.title.rendered).toBe('Updated Test Title');
  });
 
  await test.step('Get Post', async () => {
    const post = await wpApi.getPost(postId);
    expect(post.id).toBe(postId);
    expect(post.title.rendered).toBe('Updated Test Title');
  });
 
  await test.step('Delete Post', async () => {
    const time = await wpApi.deletePost(postId);
    console.log(`Post deleted in ${time} ms`);
  });
 
  await test.step('Negative cases (404, 400)', async () => {
    expect(await wpApi.getNonExistentPost(postId)).toBe(404);
    expect(await wpApi.updateNonExistentPost(postId)).toBe(404);
    expect(await wpApi.createInvalidPost()).toBe(400);
  });
});






// test.describe('WordPress Post Lifecycle', () => {
//   let apiContext;
//   let wpApi: PostApi;
//   let createdPost: WordPressPost;
//   let responseTime: number;
 
//   test.beforeAll(async ({ playwright }) => {
//     apiContext = await request.newContext();
//     wpApi = new PostApi(apiContext);

//   });
 
//   test.afterAll(async () => {
//     await apiContext.dispose();
//   });
 
//   test('Health Check', async () => {
//     await wpApi.healthCheck();
//   });
 
//   test('Create Post', async () => {
//     const { post, time } = await wpApi.createPost({
//       title: 'Initial Test Title',
//       content: 'Initial Test Content',
//       status: 'publish'
//     });
//     createdPost = post;
//     responseTime = time;
 
//     expect(createdPost).toBeDefined();
//     expect(createdPost.title.rendered).toBe('Initial Test Title');
//     console.log(`Post created in ${responseTime} ms`);
//   });
 
//   test('Update Post', async () => {
//     const { post, time } = await wpApi.updatePost(createdPost.id, {
//       title: 'Updated Test Title',
//       content: 'Updated Test Content'
//     });
 
//     expect(post.title.rendered).toBe('Updated Test Title');
//     console.log(`Post updated in ${time} ms`);
//   });
 
//   test('Get Post', async () => {
//     const post = await wpApi.getPost(createdPost.id);
//     expect(post.id).toBe(createdPost.id);
//     expect(post.title.rendered).toBe('Updated Test Title');
//   });
 
//   test('Delete Post', async () => {
//     const time = await wpApi.deletePost(createdPost.id);
//     console.log(`Post deleted in ${time} ms`);
//   });
 
//   test('Get Non-existent Post returns 404', async () => {
//     const status = await wpApi.getNonExistentPost(createdPost.id);
//     expect(status).toBe(404);
//   });
 
//   test('Update Non-existent Post returns 404', async () => {
//     const status = await wpApi.updateNonExistentPost(createdPost.id);
//     expect(status).toBe(404);
//   });
 
//   test('Create Invalid Post returns 400', async () => {
//     const status = await wpApi.createInvalidPost();
//     expect(status).toBe(400);
//   });
// });