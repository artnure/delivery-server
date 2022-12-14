const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const path = require('path')
const express = require('express');
const crypto = require('crypto');
const port = process.env.port || 5000;
const { Client } = require("pg")
const dotenv = require("dotenv")
dotenv.config()
const app = express();


const queryDb = async (query) => {
  try {
    const client = new Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      dialect: "postgres",
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false // This line will fix new error
        }
      },
    })

    await client.connect()
    const res = await client.query(query)
    // console.log(res)
    await client.end()
    return res;
  } catch (error) {
    console.log(error)
  }
}
// queryDb('SELECT * FROM users')
// queryDb(`INSERT INTO users (login, password, email, first_name, second_name)
//           VALUES ('Pilip', 'pswd123', 'email@email.email', 'Pilip', 'Orlik');`)


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("ui"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/'));


app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/ui/restaurant.html');
  commpileAndSendPage(res, 'ui/restaurant.ejs', {user: '', javascript: ''})
})

app.post('/register', (req, res) => {
  console.log(req.body);
  console.log(req.body['uname']);
  console.log(req.body['psw']);

  if (req.body['psw'][0] == req.body['psw'][1]) {
    queryDb(`INSERT INTO users (login, password, email, first_name, second_name)
              VALUES ('${req.body['uname']}', '${req.body['psw'][0]}',
              '${req.body['uname']}@email.email', '${req.body['uname']}', 'surname');`);
    res.redirect('/');
  } else {
    // res.send("Passwords don't match!")
    commpileAndSendPage(res, 'ui/restaurant.ejs',
      {user: '', javascript: "alert('Passwords don\\'t match!')"}
    )
  }
})

app.post('/signin', (req, res) => {
  console.log(req.body);
  queryDb(`SELECT * FROM users WHERE login='${req.body['uname']}' AND password='${req.body['psw']}'`).then((qres) => {
    if (qres.rows.length == 1) {
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      let data = {
          time: Date(),
          user_id: qres["rows"][0]["user_id"],
      }

      const token = jwt.sign(data, jwtSecretKey);

      res.cookie("jwt_token", token);
      // res.sendFile(__dirname + "/ui/restaurant.html");
      getUserName(qres["rows"][0]["user_id"]).then((username) => {
        console.log(username)
        commpileAndSendPage(res, 'ui/restaurant.ejs', {user: username, javascript: ''})
      })
    } else {
      // res.send('Incorrect login or password!');
      commpileAndSendPage(res, 'ui/restaurant.ejs',
        {user: '', javascript: "alert('Incorrect login or password!')"}
      )
    }
  });
})

app.get('/logout', (req, res) => {
  res.clearCookie("jwt_token");
  res.redirect('/');
})


function commpileAndSendPage(res, templateSource, arguments) {
  res.render(templateSource, arguments);
}


function get_user_id(req) {
  let cookies = req["headers"]["cookie"]
  token = cookies.split(" ").filter((arg) => arg.startsWith("jwt_token"))[0].split("=")[1]
  console.log('Cookies: ', token)
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const verified = jwt.verify(token, jwtSecretKey);
    user_id = verified.user_id;
    return user_id
  }
  catch {
    return None
  }
}

let getUserName = async (userID) => {
  return await queryDb(`SELECT * FROM users WHERE user_id=${userID}`).then((qres) => {
    if (qres.rows.length == 1) {
      return qres["rows"][0]["login"]
    } else {
      return None
    }
  })
}
// console.log(getUserName(0))


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
