import { pageRank } from '../services/UserService.js';
import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config();

describe('PageRank function', () => {
  it('should compute the PageRank of a user', async () => {
    const username = 'JaviFdez7';
    const dampingFactor = 0.85;
    const depth = 1;
    const token = "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";
    const result = await pageRank(username, dampingFactor, depth, token);
    assert.notStrictEqual(result, null);
  }).timeout(20000);
});