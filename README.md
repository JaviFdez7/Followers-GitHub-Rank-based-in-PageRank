# MC01-GraphQL-PageRank

This app uses the GitHub API and GraphQL to get user information and calculate your FollowersRank (based in PageaRank) from your list of followers. The application is developed in Node.js.

## Environment setup
1. Clone this repository
2. Open the repository locally
3. Install the dependencies in the root directory: "npm install"
4. Enter into the user-server folder
```
cd user-server
```
5. Install the dependencies: "npm install"

## Configuration
Create the .env file in the root directory and enter the token generated with github by selecting the user checkbox during creation. Once the token is generated, insert this line in the .env file:
```
TOKEN=<generated-token>
```

# MC02-PageRank-CLI
## Usage
Now you can use the command github-pagerank to calculate the bests followers of one user in github. To use the command github-pagerank, you need to install the package first. Once installed, open the terminal and run the command with the following format:
```
github-pagerank <username> [options]
```
The <username> parameter is required and should be the GitHub username for which you want to calculate the PageRank of their top followers.

The following options are available:

* -d, --damping-factor <dampingFactor>: Set the damping factor for the PageRank calculation. The default value is 0.85.
* -p, --depth <depth>: Set the depth for the PageRank calculation. The default value is 3.
* -t, --token <token>: Set the GitHub personal access token for the API requests. the default is the token defined in the .env file.
* -o, --output <filename>: Set the filename for the output file. If not provided, the result will be printed in the console.

For example, to calculate the PageRank of the top followers of the user "octocat" with a damping factor of 0.9, a precision of 2, and an output file named "result.txt", you can run the following command:

```
github-pagerank octocat -d 0.85 -p 2 -o result.txt -t <generated-token>
```

You can use too the option -h for more info of the command:
```
github-pagerank -h
```

# MC03-PageRank-API
All this section is done within the user-server directory (cd user-server).
The entire process that follows in the configuration section only needs to be done once. If you have already done the installation, it will be enough to start the docker container and initialize the already created database.

## Configuration
Install docker desktop and mongoDB compass. Once installed we will execute the following command to create a container in docker and link it with our mongo database:
```
npm i mongoose
docker run -p 27017:27017 mongo
```

Now every time you want to use the API make sure you have the docker container running.

Open mongoDB compass and create a new connection. Enter this in the new connection settings:
```
mongodb://127.0.0.1:27017/test
```

## Usage
Once the container and database are initialized, we can make use of the followersRank API. Just use the following command to deploy the server:
```
npm start
```
Open the finished link in docs shown in the console. This will open a link in your browser that will look like swagger. There you will have all the available functions offered by the API with all its features described.

---
made by [JaviFdez7](https://github.com/JaviFdez7) 
