import { pageRank, _callGitHub } from '../services/UserService.js';
import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config();

describe('PageRank function', () => {
  it('should compute the PageRank of a user', async () => {
    const username = 'alesancor1';
    const dampingFactor = 0.85;
    const depth = 1;
    const token = process.env.TOKEN;
    const result = await pageRank(username, dampingFactor, depth, token, false);
    assert.notStrictEqual(result, null);
  }).timeout(60000);
});

describe('PageRank function', () => {
  it('should compute the PageRank of a user', async () => {
    const username = 'MaToSan24';
    const dampingFactor = 0.85;
    const depth = 1;
    const token = process.env.TOKEN;
    const result = await pageRank(username, dampingFactor, depth, token, false);
    assert.ok(result.length > 0);
  }).timeout(60000);
});

describe('PageRank function', () => {
  it('should compute the PageRank of a user', async () => {
    const username = 'josemgarcia';
    const dampingFactor = 0.85;
    const depth = 1;
    const token = process.env.TOKEN;
    const result = await pageRank(username, dampingFactor, depth, token, false);
    const user = await _callGitHub(username, token);
    const followers = user.followers.length;
    assert.deepStrictEqual(result.length, followers);
  }).timeout(60000);
});

describe('PageRank function', () => {
  it('should compute the PageRank of a user', async () => {
    const username = 'pafmon';
    const dampingFactor = 0.85;
    const depth = 1;
    const token = process.env.TOKEN;
    const result = await pageRank(username, dampingFactor, depth, token, false);
    const user = await _callGitHub(username, token);
    const followers = user.followers.length;
    assert.deepStrictEqual(result.length, followers);
  }).timeout(60000);
});