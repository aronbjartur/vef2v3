import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {createCategory, getCategories, getCategory, validateCategory, updateCategory, deleteCategory } from './categories.db.js'
import {createQuestion, getQuestions, getQuestion, validateQuestion, updateQuestion, deleteQuestion } from './questions.db.js'

const app = new Hono()

app.get('/', (c) => {

  const data =  {
    hello: 'hono'
  }

  return c.json(data)
})

app.get('/categories', async (c) => {
  const categories = await getCategories();
  return c.json(categories)
})

app.get('/categories/:slug', (c) => {
  const slug = c.req.param('slug')

  // Validate á hámarkslengd á slug

  const category = getCategory(slug)

  if (!category) {
    return c.json({ message: 'not found' }, 404)
  }

  return c.json(category);
})

app.post('/categories', async (c) => {
  let categoryToCreate: unknown;
  try {
    categoryToCreate = await c.req.json();
    console.log(categoryToCreate);
  } catch (e) {
    return c.json({ error: 'invalid json' }, 400)
  }

  const validCategory = validateCategory(categoryToCreate)

  if (!validCategory.success) {
    return c.json({ error: 'invalid data', errors: validCategory.error.flatten() }, 400)
  }

  const createdCategory = await createCategory(validCategory.data)

  return c.json(createdCategory, 201)
})

// patch categories
app.patch('/categories/:slug', async (c) => {
  let updateData: unknown;
  try {
    updateData = await c.req.json();
  } catch (e) {
    return c.json({ error: 'invalid json' }, 400)
  }
  const validUpdate = validateCategory(updateData)
  if (!validUpdate.success) {
    return c.json({ error: 'invalid data', errors: validUpdate.error.flatten() }, 400)
  }
  const updatedCategory = await updateCategory(c.req.param('slug'), validUpdate.data)
  if (!updatedCategory) {
    return c.json({ message: 'not found' }, 404)
  }
  return c.json(updatedCategory, 200)
})

// delete categories
app.delete('/categories/:slug', async (c) => {
  const deleted = await deleteCategory(c.req.param('slug'))
  if (!deleted) {
    return c.json({ message: 'not found' }, 404)
  }
  return c.json(null, 204)
})


//questions

app.get('/questions', async (c) => {
  const questions = await getQuestions();
  return c.json(questions)
})

app.get('/questions/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const question = getQuestion(id);
  if (!question) {
    return c.json({ message: 'not found' }, 404)
  }
  return c.json(question);
})

// POST question
app.post('/question', async (c) => {
  let questionToCreate: unknown;
  try {
    questionToCreate = await c.req.json();
    console.log(questionToCreate);
  } catch (e) {
    return c.json({ error: 'invalid json' }, 400)
  }
  const validQuestion = validateQuestion(questionToCreate)
  if (!validQuestion.success) {
    return c.json({ error: 'invalid data', errors: validQuestion.error.flatten() }, 400)
  }
  const createdQuestion = await createQuestion(validQuestion.data)
  return c.json(createdQuestion, 201)
})

// patch question
app.patch('/question/:id', async (c) => {
  let updateData: unknown;
  try {
    updateData = await c.req.json();
  } catch (e) {
    return c.json({ error: 'invalid json' }, 400)
  }
  const validQuestion = validateQuestion(updateData)
  if (!validQuestion.success) {
    return c.json({ error: 'invalid data', errors: validQuestion.error.flatten() }, 400)
  }
  const id = parseInt(c.req.param('id'));
  const updatedQuestion = await updateQuestion(id, validQuestion.data)
  if (!updatedQuestion) {
    return c.json({ message: 'not found' }, 404)
  }
  return c.json(updatedQuestion, 200)
})

// delete question
app.delete('/question/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const deleted = await deleteQuestion(id)
  if (!deleted) {
    return c.json({ message: 'not found' }, 404)
  }
  return c.json(null, 204)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export { app };