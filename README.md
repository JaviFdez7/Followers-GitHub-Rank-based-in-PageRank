# MC01-GraphQL-PageRank and MC02-PageRank-CLI
This app uses the GitHub API and GraphQL to get user information and calculate your PageRank from your list of followers. La aplicación está escrita en Node.js.

## Environment setup
1. Clone this repository
2. Install the dependencies: "npm install"

## Usage
You can use the command github-pagerank to calculate the bests followers of one user in github. To use the command github-pagerank, you need to install the package first. Once installed, open the terminal and run the command with the following format:
```
github-pagerank <username> [options]
```
The <username> parameter is required and should be the GitHub username for which you want to calculate the PageRank of their top followers.

The following options are available:

* -d, --damping-factor <dampingFactor>: Set the damping factor for the PageRank calculation. The default value is 0.85.
* -p, --precision <precision>: Set the precision for the PageRank calculation. The default value is 3.
* -t, --token <token>: Set the GitHub personal access token for the API requests. If not provided, the requests will be unauthenticated.
* -o, --output <filename>: Set the filename for the output file. If not provided, the result will be printed in the console.

For example, to calculate the PageRank of the top followers of the user "octocat" with a damping factor of 0.9, a precision of 2, and an output file named "result.txt", you can run the following command:

```
github-pagerank octocat -d 0.9 -p 2 -o result.txt -t <token>
```

You can use too the option -h for more info of the command:
```
github-pagerank -h
```



---
made by [JaviFdez7](https://github.com/JaviFdez7) 






