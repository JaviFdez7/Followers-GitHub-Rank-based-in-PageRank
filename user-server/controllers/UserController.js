import * as service from '../services/UserService.js';

export function getUsers(req, res) {
    service.getUsers(req, res);
}

export function findInGithubByUsername(req, res) {
    service.findInGithubByUsername(req, res);
}

export function findByUsername(req, res) {
    service.findByUsername(req, res);
}

export function createUser(req, res) {
    service.createUser(req, res);
}

export function createPageRankComputation(req, res) {
    service.createPageRankComputation(req, res);
}

export function getFollowersRankingByComputationId(req, res) {
    service.getFollowersRankingByComputationId(req, res);
}


