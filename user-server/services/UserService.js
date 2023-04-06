import axios from 'axios';
import User from "../models/User.js";
import PageRankFollowers from "../models/PageRankFollowers.js";

export function getUsers(req, res) {
  User.find().then((users) => {
    res.send(users);
  }).catch(err => {
    res.send({message: err.message});
  });
}

export function findByusername(req, res) {
    const username = res.locals.oas.params.username;
    _callGitHub(username, tokenPred).then((usuario) => {
      res.send(usuario);
    }).catch(err => {
      res.status(500).send({message: err.message});
    });
  }

  export async function createUser(req, res) {
    try {
      const username = res.locals.oas.params.username;
      const usuario = await _callGitHub(username, tokenPred);
      const user = await User.create(usuario);
      res.status(201).send(user);
    } catch (err) {
      res.status(500).send({ message: "Error al crear usuario: " + err.message });
    }
  }
  

  export function createPageRankComputation(req, res){

  }

  export function getFollowersRankingByComputationId(req, res){

  }

const tokenPred = "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"

async function _callGitHub(username,tokenIn){
    const token = tokenIn;
    const apiUrl = 'https://api.github.com/graphql';
    const requestConfig = { Authorization: "Bearer " + token, Accept: 'application/vnd.github.starfox-preview+json' };
    const query = `{
        user(login: "${username}") {
          status {
            message
          }
          bio
          avatarUrl
          followers(first: 10) {
            nodes {
              login
            }
          }
          following(first: 10) {
            nodes {
              login
            }
          }
          issues(first: 10) {
            nodes {
              title
              state
              createdAt
            }
          }
        }
      }`

      const result = await axios.post(apiUrl, { query }, { headers: requestConfig });
      
      if (result) {
        const userData = result.data.data.user;
            const usuario = {
            username: username,
            status: userData.status ? userData.status.message : null,
            bio: userData.bio,
            avatarUrl: userData.avatarUrl,
            followers: userData.followers.nodes.map(follower => follower.login),
            following: userData.following.nodes.map(following => following.login),
            issues: userData.issues.nodes.map(issue => {
              return {
                title: issue.title,
                state: issue.state,
                createdAt: issue.createdAt
              };
            })
          };
          return usuario;

      } 
    }

    export async function pageRank(username, d, p, tokenIn){
        const user = await _callGitHub(username,tokenIn)
        const followers = user.followers;
        const followersSize = followers.length; 
        let i = 0;
        let result = 0;
        let resultArray = [];
        for(i=0;i<followersSize;i++){
            const useri = await _callGitHub(followers[i],tokenIn);
            result = await pageRankRecursive(followers[i],d,p, 0, tokenIn)
            resultArray.push({username: useri.username, score: result});
            console.log(`${i}: ${followers[i]} = ${result}`)
          }
        return resultArray;
    }

    async function pageRankRecursive(username, d, p, ac, tokenIn){
      const usuario = await _callGitHub(username,tokenIn);
      const followers = usuario.followers;
      const followersSize = followers.length;
      let pageRankSum = 0; // Creamos una variable para almacenar la sumatoria de los PageRank de los followers
      if(p==0 || followersSize==0){ // Caso base -> profundidad máxima alcanzada o el usuario que estamos buscando tiene 0 followers
        return (1-d)
      }else {
        for(let i=0; i<followersSize; i++){
          const useri = await _callGitHub(followers[i],tokenIn);
          const followingOfi = useri.following.length;
          const followerPageRank = await pageRankRecursive(followers[i], d, p-1,ac, tokenIn); // Llamamos de forma recursiva a la función para obtener el PageRank del follower
          if(followingOfi==0){
            pageRankSum += followerPageRank/1; // Si no sigue a nadie (hay admins en github que no siguen a nadie, pero la gente les sigue)
          }else {
            pageRankSum += followerPageRank/followingOfi; // Sumamos el PageRank del follower a la sumatoria
          }
        };
        const pageRank = (1-d) + d*(pageRankSum); // Calculamos el PageRank del usuario actual usando la sumatoria de los PageRank de los followers
        return pageRank;
      }
    }


