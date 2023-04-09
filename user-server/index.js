import server from './server.js';

const env = process.env.NODE_ENV ?? "production";

server.deploy(env).catch((err) => console.log(err));

process.on('SIGINT', function onSigint () {
    console.log("Graceful shutdown");
    shutdown();
});

process.on('SIGINT', function onSigterm () {
    console.log("Graceful shutdown");
    shutdown();
});

const shutdown = () => {
    server.undeploy();
};