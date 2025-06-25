const { app } = require("./app.js");
const { env } = require("./config");
const connectDB = require('./config/db/walletdb.js');

connectDB()
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);                                                                                                                                                
});
