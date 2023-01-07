const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
const dbPath = path.join(__dirname, "userData.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running At http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DBerror: ${e}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.post("/register/", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const query = `
  SELECT *
  FROM user
  WHERE username = '${username}'`;
  const dbData = await db.get(query);
  if (dbData !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    if (password.length < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const insertQuery = `
      INSERT INTO user(username, name, password, gender, location)
      VALUES('${username}', '${name}', '${hashedPassword}', '${gender}', '${location}')`;
      const dbUser = await db.run(insertQuery);
      console.log(dbUser);
      response.status(200);
      response.send("User created successfully");
    }
  }
});

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
});
