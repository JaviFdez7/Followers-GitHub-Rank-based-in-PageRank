import http from "http";
import express from "express";
import { initialize, use } from "@oas-tools/core";
import { connectDB } from "./db.js";
import dotenv from 'dotenv';
dotenv.config();

const deploy = async (env) => {
    const serverPort = process.env.PORT ?? 8080;
    const app = express();
    app.use(express.json({ limit: '50mb' }));
    
    const config = {
        middleware: {
            security: {
                auth: {
                }
            }
        }
    }
    const mongoUrl = process.env.MONGO_URL ?? "mongodb://127.0.0.1:27017/test";
    
    connectDB(mongoUrl).then(() => {
        use((req, res, next) => {res.setHeader("Content-Type","application/json"); next();}, {}, 0);
        initialize(app, config).then(() => {
            http.createServer(app).listen(serverPort, () => {
                console.log("\nApp running at http://localhost:" + serverPort);
                console.log("________________________________________________________________");
                if (!config?.middleware?.swagger?.disable) {
                    console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
                    console.log("________________________________________________________________");
                }
            });
        });
    });
}

const undeploy = () => {
    process.exit();
}

export default { deploy, undeploy }