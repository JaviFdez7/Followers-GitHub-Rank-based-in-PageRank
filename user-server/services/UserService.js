import axios from 'axios';

export function getUsers(req, res) {
    res.send({
        message: 'This is the mockup controller for getUsers'
    });
}

export function findByusername(req, res) {
    const username = res.locals.oas.params.username;
    pageRank(username, 0.85, 1, tokenPred);
    _callGitHub(username, tokenPred).then((usuario) => {
      res.send(usuario);
    }).catch(err => {
      res.status(500).send({message: err.message});
    });
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
            status: userData.status,
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
        const user = await _callGitHub(username,tokenIn).then(async (usuario)=> {
            const followers = usuario.followers;
            const followersSize = followers.length; 
            let i = 0;
            let result = 0;
            let resultArray = [];
            for(i=0;i<followersSize;i++){
              const useri = await _callGitHub(followers[i],tokenIn);
              result = await pageRankRecursive(followers[i],d,p, 0, tokenIn)
              const followerMap = new Map();
              followerMap.set(useri.username, result);
              resultArray.push(followerMap);
              console.log(`${i}: ${followers[i]} = ${result}`)
            }
            console.log(resultArray);
            return resultArray;
        })
    }

    async function pageRankRecursive(username, d, p, ac, tokenIn){
      const usuario = await _callGitHub(username,tokenIn);
      const followers = usuario.followers;
      const followersSize = followers.length;
      let pageRankSum = 0; // Creamos una variable para almacenar la sumatoria de los PageRank de los followers
      if(p==0 || followersSize==0){
        return (1-d)
      }else {
        for(let i=0; i<followersSize; i++){
          const useri = await _callGitHub(followers[i],tokenIn);
          const followingOfi = useri.following.length;
          const followerPageRank = await pageRankRecursive(followers[i], d, p-1,ac, tokenIn); // Llamamos de forma recursiva a la función para obtener el PageRank del follower
          pageRankSum += followerPageRank/followingOfi; // Sumamos el PageRank del follower a la sumatoria
        };
        const pageRank = (1-d) + d*(pageRankSum); // Calculamos el PageRank del usuario actual usando la sumatoria de los PageRank de los followers
        return pageRank;
      }
    }


