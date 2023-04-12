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


# MC04-Despliegue-con-Docker-Compose
*These steps will be done in the root folder of the project and with docker compose open.*

We create the .env file in the root of the project that will be used to start our server and enter the following:
```
TOKEN=<your-github-token>
```
And now we start the server with the following command
```
docker-compose --env-file .env up -d
```
Now the application will be usable thanks to docker compose, every time you want to use the application just open docker-compose and run the container in which our deployment is hosted


# MC05-BlueJay-y-SLAs
First we access the bluejay-infrastructure folder and create a new .env file with the following information. The only one that needs to be entered is the personal github token:


```
GOV_INFRASTRUCTURE=http://host.docker.internal:5200/api/v1/public/infrastructure-local.yaml
NODE_ENV=development

# Repository branch that will be cloned into assetsmanager
ASSETS_REPOSITORY_BRANCH=develop

# Influx database url
INFLUX_URL=http://host.docker.internal:5002

# EVENT COLLECTOR
KEY_GITHUB=<your-github-token>

# FRONTENDS ACCESS ACCOUNT
USER_RENDER=a
PASS_RENDER=a
USER_ASSETS=a
PASS_ASSETS=a

# ASSETS MANAGER
KEY_ASSETS_MANAGER_PRIVATE=bluejay-assets-private-key

# SCOPE MANAGER
KEY_SCOPE_MANAGER=bluejay-scopes-private-key

# COMPOSE CONFIG
COMPOSE_HTTP_TIMEOUT=200
```

We carry out the deployment with the following command inside the bluejay-infrastructure directory:
```
docker-compose -f docker-bluejay/docker-compose-local.yaml --env-file .env up -d
```

Now, we have access to the bluejay infrastructure

Copy this in your browser: localhost:5100

And introduce de user: a; password: a;

POSTMAN COMAND: 
```
DELETE
http://localhost:5400/api/v6/agreements/tpa-project01
```
```
POST
http://localhost:5400/api/v6/agreements

Body raw JSON:
{
    "id": "tpa-project01",
    "version": "1.0.0",
    "type": "agreement",
    "context": {
        "validity": {
            "initial": "2019-01-01",
            "timeZone": "America/Los_Angeles"
        },
        "definitions": {
            "schemas": {},
            "dashboards": {
                "main": {
                    "base": "http://host.docker.internal:5200/api/v1/public/grafana-dashboards/tpa/base.json",
                    "modifier": "http://host.docker.internal:5200/api/v1/public/grafana-dashboards/tpa/modifier.js",
                    "overlay": "http://host.docker.internal:5200/api/v1/public/grafana-dashboards/tpa/overlay.js",
                    "config": {}
                }
            },
            "scopes": {
                "development": {
                    "project": {
                        "name": "Project",
                        "description": "Project",
                        "type": "string",
                        "default": "project01"
                    },
                    "class": {
                        "name": "Class",
                        "description": "Group some projects",
                        "type": "string",
                        "default": "template"
                    }
                }
            },
            "collectors": {
                "eventcollector": {
                    "infrastructurePath": "internal.collector.events",
                    "endpoint": "/api/v2/computations",
                    "type": "POST-GET-V1",
                    "config": {
                        "scopeManager": "http://host.docker.internal:5700/api/v1/scopes/development"
                    }
                }
            }
        }
    },
    "terms": {
        "metrics": {
            "NUMBER_GITHUB_PR": {
                "collector": {
                    "infrastructurePath": "internal.collector.events",
                    "endpoint": "/api/v2/computations",
                    "type": "POST-GET-V1",
                    "config": {
                        "scopeManager": "http://host.docker.internal:5700/api/v1/scopes/development"
                    }
                },
                "measure": {
                    "computing": "actual",
                    "element": "number",
                    "event": {
                        "github": {
                            "allPR": {}
                        }
                    },
                    "scope": {
                        "project": {
                            "name": "Project",
                            "description": "Project",
                            "type": "string",
                            "default": "project01"
                        },
                        "class": {
                            "name": "Class",
                            "description": "Group some projects",
                            "type": "string",
                            "default": "template"
                        }
                    }
                }
            }
        },
        "guarantees": [
            {
                "id": "NUMBER_GH_PR_DAILY_OVER_1_OR_EQUAL",
                "notes": "#### Description\r\n```\r\nTP-1: At least PR within a week.",
                "description": "At least 1 PR within a week.",
                "scope": {
                    "project": {
                        "name": "Project",
                        "description": "Project",
                        "type": "string",
                        "default": "project01"
                    },
                    "class": {
                        "name": "Class",
                        "description": "Group some projects",
                        "type": "string",
                        "default": "template"
                    }
                },
                "of": [
                    {
                        "scope": {
                            "project": "project01"
                        },
                        "objective": "NUMBER_GITHUB_PR >= 1",
                        "with": {
                            "NUMBER_GITHUB_PR": {}
                        },
                        "window": {
                            "type": "static",
                            "period": "weekly",
                            "initial": "2018-01-01"
                        }
                    }
                ]
            }
        ]
    }
}
```

Dashboard user and password:

User: governify-admin

Password: governify-project


# OC01-Tests-y-CI

Unit tests have been created with Mocha. If you access the user-server directory and execute the following command you will be able to pass the tests manually:

```
npx mocha test/test.js
```


---
made by [JaviFdez7](https://github.com/JaviFdez7) 
