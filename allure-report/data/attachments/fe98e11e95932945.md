# Test info

- Name: WordPress Post Lifecycle >> should handle errors appropriately
- Location: /Users/natali/Desktop/Projects/apitest/tests/crudOld.spec.ts:159:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 201
    at /Users/natali/Desktop/Projects/apitest/tests/crudOld.spec.ts:186:42
```

# Test source

```ts
   86 |         await new Promise(resolve => setTimeout(resolve, 1000)); //чекаємо створення перед редагуванням
   87 |  
   88 |    
   89 |         const editStartTime = Date.now(); //редагування дати константа
   90 |         
   91 |         const updateData = {
   92 |             title: 'Updated Lifecycle Post',
   93 |             content: 'Updated content for lifecycle testing',
   94 |         };
   95 |         
   96 |         const editResponse = await request.put(`${baseUrl}/posts/${createdPost.id}`, {
   97 |             headers: {
   98 |             'Authorization': `Basic ${credentials}`,
   99 |             'Content-Type': 'application/json'
  100 |             },
  101 |             data: updateData
  102 |         });
  103 |         
  104 |         const editTime = Date.now() - editStartTime;
  105 |         expect(editTime).toBeLessThan(PERFORMANCE_TIMEOUT); //'Edit operation should be fast'
  106 |         expect(editResponse.status()).toBe(200); //'Post should be updated'
  107 |  
  108 |         const updatedPost = await editResponse.json() as WordPressPost;
  109 |         expect(updatedPost.id).toBe(createdPost.id); //'Post ID should remain the same'
  110 |         expect(updatedPost.title.rendered).toBe(updateData.title);
  111 |         expect(updatedPost.content.rendered).toContain(updateData.content);
  112 |         expect(updatedPost.modified).not.toBe(createdPost.modified); // 'Modified date should be updated'
  113 |  
  114 |   
  115 |         const getResponse = await request.get(`${baseUrl}/posts/${createdPost.id}`, {
  116 |             headers: {
  117 |             'Authorization': `Basic ${credentials}`
  118 |             }
  119 |             });
  120 |         expect(getResponse.status()).toBe(200); //'Should be able to get updated post'
  121 |         
  122 |         const retrievedPost = await getResponse.json() as WordPressPost;
  123 |         expect(retrievedPost.title.rendered).toBe(updateData.title);
  124 |         expect(retrievedPost.content.rendered).toContain(updateData.content);
  125 |  
  126 |         await new Promise(resolve => setTimeout(resolve, 1000));
  127 |  
  128 |         const deleteStartTime = Date.now();
  129 |         const deleteResponse = await request.delete(`${baseUrl}/posts/${createdPost.id}?force=true`, {
  130 |             headers: {
  131 |             'Authorization': `Basic ${credentials}`
  132 |             }
  133 |         });
  134 |  
  135 |         const deleteTime = Date.now() - deleteStartTime;
  136 |         expect(deleteTime).toBeLessThan(PERFORMANCE_TIMEOUT);  //'Delete operation should be fast'
  137 |         expect(deleteResponse.status()).toBe(200); //'Post should be deleted'
  138 |  
  139 |         //Проверка, что статья действительно удалена
  140 |         const checkDeletedResponse = await request.get(`${baseUrl}/posts/${createdPost.id}`, {
  141 |             headers: {
  142 |             'Authorization': `Basic ${credentials}`
  143 |              }
  144 |         });
  145 |
  146 |         expect(checkDeletedResponse.status()).toBe(404); //'Deleted post should not be accessible'
  147 |  
  148 |     
  149 |         const totalTime = createTime + editTime + deleteTime;
  150 |             console.log({
  151 |             createTime: `${createTime}ms`,
  152 |             editTime: `${editTime}ms`,
  153 |             deleteTime: `${deleteTime}ms`,
  154 |             totalTime: `${totalTime}ms`
  155 |         });
  156 |     });
  157 |  
  158 |  
  159 |   test('should handle errors appropriately', async ({ request }) => {
  160 |     // Попытка редактирования несуществующей статьи
  161 |         const nonExistentId = 999999;
  162 |         const errorResponse = await request.put(`${baseUrl}/posts/${nonExistentId}`, {
  163 |             headers: {
  164 |             'Authorization': `Basic ${credentials}`,
  165 |             'Content-Type': 'application/json'
  166 |             },
  167 |             data: {
  168 |             title: 'This should fail',
  169 |             content: 'This update should fail'
  170 |             }
  171 |         });
  172 |  
  173 |         expect(errorResponse.status()).toBe(404);
  174 |
  175 |         const invalidResponse = await request.post(`${baseUrl}/posts`, {
  176 |             headers: {
  177 |             'Authorization': `Basic ${credentials}`,
  178 |             'Content-Type': 'application/json'
  179 |             },
  180 |             data: {
  181 |             // Пропускаем обязательное поле title
  182 |             content: 'This should fail due to missing title'
  183 |              }
  184 |         });
  185 |  
> 186 |         expect(invalidResponse.status()).toBe(400);
      |                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  187 |          });
  188 | });
```