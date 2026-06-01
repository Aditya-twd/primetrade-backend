import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

const user = { name: 'Test User', email: 'test@example.com', password: 'Passw0rd!' };

describe('Auth', () => {
  it('registers a new user and returns an access token', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.password).toBeUndefined(); // never leak the hash
  });

  it('rejects duplicate registration', async () => {
    await request(app).post('/api/v1/auth/register').send(user);
    const res = await request(app).post('/api/v1/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  it('rejects weak passwords', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...user, password: 'weak' });
    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty('password');
  });

  it('logs in with valid credentials and rejects bad ones', async () => {
    await request(app).post('/api/v1/auth/register').send(user);

    const ok = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });
    expect(ok.status).toBe(200);
    expect(ok.body.data.accessToken).toBeTruthy();

    const bad = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'WrongPass1' });
    expect(bad.status).toBe(401);
  });

  it('blocks /auth/me without a token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
