const app = require("./index.js");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Application specific logging, throwing an error, or other logic here

    // Gracefully shut down the server
    server.close(() => {
        console.log('Server closed due to uncaught exception');
        process.exit(1);
    });
});
