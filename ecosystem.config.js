// // ecosystem.config.js
// module.exports = {
//   apps: [
//     {
//       name: 'ecommerce-api-design',       // Any name
//       script: './server.js',           // Your entry point
//       instances: 'max',                // Uses all CPU cores
//       exec_mode: 'cluster',            // Enables clustering
//       env: {
//         NODE_ENV: 'development',
//         PORT: process.env.PORT                     // Your .env should match this
//       },
//       env_production: {
//         NODE_ENV: 'production',
//         PORT: process.env.PORT  
//       }
//     }
//   ]
// };
