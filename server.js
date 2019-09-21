// Initialize Express
const app = require('./config/express-config')
const PORT = 3333

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
