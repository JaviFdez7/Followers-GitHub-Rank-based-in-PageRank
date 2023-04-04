import * as service from '../services/UserService.js';

export function getUsers(req, res) {
    service.getUsers(req, res);
}

export function findByusername(req, res) {
    service.findByusername(req, res);
}

