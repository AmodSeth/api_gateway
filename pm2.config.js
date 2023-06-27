const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    apps: [
      {
        name: "API-GATEWAY",
        script: "index.js",
        instances: isProduction ? "max" : 1,
        exec_mode: isProduction ? "cluster" : "fork",
        autorestart: true,
        watch: getWatchOption(),
        env: {
            NODE_ENV: process.env.NODE_ENV || "production",
        },
        merge_logs: true,
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        output: "./logs/app.log",
        error: "./logs/app.log",
        },
    ],
  };

function getWatchOption() {
if (isProduction) {
    return false;
} else {
    return ["./", "!./logs/**","!Dockerfile"]; // Exclude the logs directory from watch
}
}