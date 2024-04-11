import request from 'supertest';
import { application, Shutdown } from '../../src/server';

describe('Application', () => {
    afterAll((done) => {
        Shutdown(done);
    });

    it('Stars and has the proper test environment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(application).toBeDefined();
    }, 10000);

    it('Returns all options allowed to be called by customers (http methods)', async () => {
        const response = await request(application).options('/');
        expect(response.status).toBe(200);
        expect(response.headers['access-control-allow-methods']).toBe('PUT, POST, PATCH, DELETE, GET');
    });
});
