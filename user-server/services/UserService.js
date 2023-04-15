import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import User from "../models/User.js";
import PageRankFollowers from "../models/PageRankFollowers.js";
import dotenv from 'dotenv';
dotenv.config();

const tokenPred = process.env.TOKEN;

//Shows all users published in the mongo database
export function getUsers(req, res) {
  User.find().then((users) => {
    res.send(users);
  }).catch(err => {
    res.send({message: err.message});
  });
}

//Find a user by username in the mongo database
export function findByUsername(req, res) {
  const username = res.locals.oas.params.username;
  User.findOne({username}).then((usuario) => {
    res.send(usuario)
  }).catch(err => {
    res.status(500).send({message: err.message});
  });
}

//Find a user in the github API by username
export function findInGithubByUsername(req, res) {
    const username = res.locals.oas.params.username;
    _callGitHub(username, tokenPred).then((usuario) => {
      res.send(usuario);
    }).catch(err => {
      res.status(500).send({message: err.message});
    });
  }

  //Create a user by searching for it on Github by username and it will be published to the mongo database
  export async function createUser(req, res) {
    try {
      const username = res.locals.oas.params.username;
      const usuario = await _callGitHub(username, tokenPred);
      const user = await User.create({
        username: usuario.username,
        status: usuario.status ? usuario.status.message : null,
        bio: usuario.bio,
        avatarUrl: usuario.avatarUrl,
        followers: usuario.followers,
        following: usuario.following,
        issues: usuario.issues,
        followersRank: []
      });      
      res.status(201).send(user);
    } catch (err) {
      res.status(500).send({ message: "Error creating user: " + err.message });
    }
  }

  //PageRank async post in mongo database
  export async function createPageRankComputation(req, res) {
    try {
      const username = res.locals.oas.params.username;
      const dampingFactor = res.locals.oas.params.dampingfactor || 0.85;
      const depth = res.locals.oas.params.depth || 3;
      const computationId = uuidv4(); 
      await PageRankFollowers.create({
        computationId: computationId,
        status: "IN_PROGRESS",
        params: { username: username, dampingfactor: dampingFactor, depth: depth },
        result: [{
          depth: 0,
          dampingfactor: dampingFactor,
          date: new Date(),
          score: 0.15
        }]
      });
      res.status(201).send({computationId: computationId});
      console.log(`ComputationId send: ${computationId}`);
      try {
        console.log("PageRank in progress");
  
        await PageRankFollowers.updateOne(
          { computationId: computationId },
          {
            $set: {
              status: "COMPLETED",
              params: { username: username, dampingfactor: dampingFactor, depth: depth },
              result: await pageRank(username, dampingFactor, depth, tokenPred) 
            }
          }
        );
        console.log("Completed and updated");
      } catch (error) {
        console.log("Error updating the instance of PageRankFollowers: " + error);
      }
    } catch (err) {
      res.status(500).send({ message: "Error creating the instance of PageRankFollowers: " + err.message });
    }
  }
  
  
  //PageRank async get by computationId from mongo database
  export async function getFollowersRankingByComputationId(req, res){
    try {
      const computationId = res.locals.oas.params.computationId;
      const pageRankFollowers = await PageRankFollowers.findOne({ computationId: computationId });
      if (pageRankFollowers) {
        const ranking = pageRankFollowers;
        res.status(200).send(ranking);
      } else {
        res.status(404).send({ message: "No PageRank calculation found for the specified computatioId" });
      }
    } catch (err) {
      res.status(500).send({ message: "Error getting followers ranking: " + err.message });
    }
  }
  

//User info from graphQL 
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


    //PageRank recursive function 
    export async function pageRank(username, df, depth, tokenIn){
        const user = await _callGitHub(username,tokenIn)
        const followers = user.followers;
        const followersSize = followers.length; 
        let result = 0;
        let resultArray = [];
        for(let i=0;i<followersSize;i++){
            const usernamei = followers[i];
            let pageRank = await findScoreByDepthAndDampingFactor(usernamei, depth, df);
            if(!pageRank){
              const githubuser = await _callGitHub(usernamei,tokenIn);
              result = await pageRankRecursive(githubuser,df,depth, tokenIn)
              resultArray.push({username: usernamei, score: result});
            } else {
              result = pageRank
              resultArray.push({username: usernamei, score: result});
            };
            console.log(`${i}: ${followers[i]} = ${result}`);
          }
        return resultArray;
    }

    async function pageRankRecursive(user, df, depth, tokenIn){
      const followers = user.followers;
      const followersSize = followers.length;
      let pageRankSum = 0; // Creamos una variable para almacenar la sumatoria de los PageRank de los followers
      if(depth==0 || followersSize==0){ // Caso base -> profundidad máxima alcanzada o el usuario que estamos buscando tiene 0 followers
        const result = 1-df;
        await findOneAndUpdate(user, depth, df, result);
        return result;
      }else {
        let pageRank = await findScoreByDepthAndDampingFactor(user.username, depth, df);
        if(!pageRank){
          for(let i=0; i<followersSize; i++){
              const userDatabase = await findOneUser(followers[i])

              let followingOfi = 0;
              let followerPageRank = 0;

              if(!userDatabase){
                const useri = await _callGitHub(followers[i],tokenIn);
                
                followingOfi = useri.following.length;
                followerPageRank = await pageRankRecursive(useri, df, depth-1, tokenIn); // Llamamos de forma recursiva a la función para obtener el PageRank del follower
              } else {
                followingOfi = userDatabase.following.length;
                followerPageRank = await pageRankRecursive(userDatabase, df, depth-1, tokenIn); // Llamamos de forma recursiva a la función para obtener el PageRank del follower
              }
         
            if(followingOfi==0){
              pageRankSum += followerPageRank/1; // Si no sigue a nadie (hay admins en github que no siguen a nadie, pero pero aparecen en los seguidores de algunos usuarios)
            }else {
              pageRankSum += followerPageRank/followingOfi; // Sumamos el PageRank del follower al sumatoria y dividimos entre su las personas a las que sigue
            }
          };
          let pageRank = (1-df) + df*(pageRankSum); // Calculamos el PageRank del usuario actual usando la sumatoria de los PageRank de los followers
          
          await findOneAndUpdate(user, depth, df, pageRank);

          return pageRank;
        } else{
          return pageRank;
        }
      }
    }


    // Busca un usuario y comprueba si está en la base de datos, si no existe crea uno nuevo con los datos del followerRank calculado
    // si sí está comprueba en primer lugar si está ya calculado, si lo está no hace nada, si no lo está introduce un nuevo followerRank
    // para ese usuario
    async function findOneAndUpdate(user, depth, dampingFactor, score) {
      const filter = { username: user.username };
      const existingUser = await User.findOne(filter);
      
      if (!existingUser) {
          const user1 = await User.create({
          username: user.username,
          status: user.status ? user.status.message : null,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          followers: user.followers,
          following: user.following,
          issues: user.issues,
          followersRank: [{
              depth: depth,
              dampingfactor: dampingFactor,
              date: new Date(),
              score: score
            }]
        }); 
        
      } else {
          const actualDate = new Date().getTime();

          const rankExists = existingUser.followersRank.some(rank => {
          const rankTime = new Date(rank.date).getTime();
          return rank.depth === depth && rank.dampingfactor === dampingFactor && actualDate - rankTime < 7 * 24 * 60 * 60 * 1000;
        });

        if(!rankExists){
          const update = {
            $push: {
              followersRank: {
                depth: depth,
                dampingfactor: dampingFactor,
                date: new Date(),
                score: score
              }
            }
          };
          const options = { new: true, upsert: true };
          await User.findOneAndUpdate(filter, update, options);
        }
      }
    }
    
    // comprueba si el usuario tiene el followerRank. Si lo tiene devuelve el resultado, si no devuelve falso
    async function findScoreByDepthAndDampingFactor(usert, depth, dampingFactor) {
      const user = await User.findOne({ username: usert });
      if (!user) {
        return false;
      }
    
      const followersRank = user.followersRank;
      const actualDate = new Date().getTime();
      for (let i = 0; i < followersRank.length; i++) {
        const rank = followersRank[i];
        if (rank.depth === depth && rank.dampingfactor === dampingFactor && rank.date) {
          const rankTime = new Date(rank.date).getTime();
          if (actualDate - rankTime < 7 * 24 * 60 * 60 * 1000) { //milisegundo que dura una semana -> comprueba que el dato sea de antes de 1 semana
            return rank.score;
          }
        }
      }
    
      return false;
    }

    async function findOneUser(usert) {
      const user = await User.findOne({ username: usert });
      if (!user) {
        return false;
      } else
      return user;
    }