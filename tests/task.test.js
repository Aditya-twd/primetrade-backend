import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

async function registerAndToken(email) {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Test User', email, password: 'Passw0rd!' });
  return res.body.data.accessToken;
}

describe('Tasks CRUD + ownership', () => {
  let token;
  beforeEach(async () => {
    token = await registerAndToken('owner@example.com');
  });

  it('requires auth', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.status).toBe(401);
  });

  it('creates, reads, updates and deletes a task', async () => {
    const created = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My task', priority: 'high' });
    expect(created.status).toBe(201);
    const id = created.body.data.id;

    const list = await request(app).get('/api/v1/tasks').set('Authorization', `Bearer ${token}`);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.meta.total).toBe(1);

    const updated = await request(app)
      .patch(`/api/v1/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });
    expect(updated.body.data.status).toBe('done');

    const del = await request(app)
      .delete(`/api/v1/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
  });

  it('does not leak another user\'s tasks', async () => {
    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Secret' });

    const otherToken = await registerAndToken('other@example.com');
    const list = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${otherToken}`);
    expect(list.body.data).toHaveLength(0);
  });

  it('validates task input', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });
});
