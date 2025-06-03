import { test, expect } from '@playwright/test';
 
interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  sticky: boolean;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: object;
}
 
test.describe('WordPress Post Lifecycle', () => {
  const baseUrl = 'https://dev.emeli.in.ua/wp-json/wp/v2';
  const credentials = Buffer.from('admin:Engineer_123').toString('base64');
  const PERFORMANCE_TIMEOUT = 3000;
 
    test.beforeAll(async ({ request }) => {
    const healthCheck = await request.get(`${baseUrl}/posts`, {
    headers: {
        'Authorization': `Basic ${credentials}`
         }
         });
        expect(healthCheck.status()).toBe(200); //'API should be accessible'
    });
 
    test('should handle full post lifecycle - create, edit, delete', async ({ request }) => {
        const createStartTime = Date.now(); //поточна дата
        
        const createData = {
            title: 'Test Lifecycle Post',
            content: 'Initial content for lifecycle testing',
            status: 'publish', //передаємо json
            sticky: true,
            comment_status: 'open',
            ping_status: 'closed',
            template: '',
            meta: {
                footnotes: ""
            },
            author: 1
            };
       
            const createResponse = await request.post(`${baseUrl}/posts`, {
            headers: {
            'Authorization': `Basic ${credentials}`, //авторизація
            'Content-Type': 'application/json'  //передаємо в json
             },
            data: createData //payload / body запиту
            });
        
        const createTime = Date.now() - createStartTime; //початок запиту
            expect(createTime).toBeLessThan(PERFORMANCE_TIMEOUT); //'Create operation should be fast'
            expect(createResponse.status()).toBe(201); //'Post should be created'
        
        const createdPost = await createResponse.json() as WordPressPost; //перевіряємо тип поля
            expect(createdPost.id).toBeTruthy(); //'Created post should have an ID' - первірка що id існує
            expect(createdPost.title.rendered).toBe(createData.title); //що те що вели отримали в запиті
            expect(createdPost.content.rendered).toContain(createData.content); //так само
            expect(createdPost.status).toContain(createData.status);
            expect(createdPost.sticky).toBe(createData.sticky); //перевірка що sticky true
            expect(createdPost.comment_status).toContain(createData.comment_status);
            expect(createdPost.ping_status).toContain(createData.ping_status);
            expect(createdPost.template).toContain(createData.template);
            expect(createdPost.meta).toMatchObject(createData.meta);
            expect(createdPost.author).toBe(createData.author); //перевірка що автор 1
   
        await new Promise(resolve => setTimeout(resolve, 1000)); //чекаємо створення перед редагуванням
 
   
        const editStartTime = Date.now(); //редагування дати константа
        
        const updateData = {
            title: 'Updated Lifecycle Post',
            content: 'Updated content for lifecycle testing',
        };
        
        const editResponse = await request.put(`${baseUrl}/posts/${createdPost.id}`, {
            headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
            },
            data: updateData
        });
        
        const editTime = Date.now() - editStartTime;
        expect(editTime).toBeLessThan(PERFORMANCE_TIMEOUT); //'Edit operation should be fast'
        expect(editResponse.status()).toBe(200); //'Post should be updated'
 
        const updatedPost = await editResponse.json() as WordPressPost;
        expect(updatedPost.id).toBe(createdPost.id); //'Post ID should remain the same'
        expect(updatedPost.title.rendered).toBe(updateData.title);
        expect(updatedPost.content.rendered).toContain(updateData.content);
        expect(updatedPost.modified).not.toBe(createdPost.modified); // 'Modified date should be updated'
 
  
        const getResponse = await request.get(`${baseUrl}/posts/${createdPost.id}`, {
            headers: {
            'Authorization': `Basic ${credentials}`
            }
            });
        expect(getResponse.status()).toBe(200); //'Should be able to get updated post'
        
        const retrievedPost = await getResponse.json() as WordPressPost;
        expect(retrievedPost.title.rendered).toBe(updateData.title);
        expect(retrievedPost.content.rendered).toContain(updateData.content);
 
        await new Promise(resolve => setTimeout(resolve, 1000));
 
        const deleteStartTime = Date.now();
        const deleteResponse = await request.delete(`${baseUrl}/posts/${createdPost.id}?force=true`, {
            headers: {
            'Authorization': `Basic ${credentials}`
            }
        });
 
        const deleteTime = Date.now() - deleteStartTime;
        expect(deleteTime).toBeLessThan(PERFORMANCE_TIMEOUT);  //'Delete operation should be fast'
        expect(deleteResponse.status()).toBe(200); //'Post should be deleted'
 
        //Проверка, что статья действительно удалена
        const checkDeletedResponse = await request.get(`${baseUrl}/posts/${createdPost.id}`, {
            headers: {
            'Authorization': `Basic ${credentials}`
             }
        });

        expect(checkDeletedResponse.status()).toBe(404); //'Deleted post should not be accessible'
 
    
        const totalTime = createTime + editTime + deleteTime;
            console.log({
            createTime: `${createTime}ms`,
            editTime: `${editTime}ms`,
            deleteTime: `${deleteTime}ms`,
            totalTime: `${totalTime}ms`
        });
    });
 
 
  test('should handle errors appropriately', async ({ request }) => {
    // Попытка редактирования несуществующей статьи
        const nonExistentId = 999999;
        const errorResponse = await request.put(`${baseUrl}/posts/${nonExistentId}`, {
            headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
            },
            data: {
            title: 'This should fail',
            content: 'This update should fail'
            }
        });
 
        expect(errorResponse.status()).toBe(404);

        const invalidResponse = await request.post(`${baseUrl}/posts`, {
            headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
            },
            data: {
            // Пропускаем обязательное поле title
            content: 'This should fail due to missing title'
             }
        });
 
        expect(invalidResponse.status()).toBe(400);
         });
});