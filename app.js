if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const express = require("express")
const cors = require("cors")
const morgan = require('morgan');
const app = express()
const PORT = process.env.PORT || 3001

const ControllerUser = require("./controllers/ControllerUser")
const authentication = require("./middlewares/authentication")
const authorization = require("./middlewares/authorization")
const errorHandler = require('./middlewares/errorHandler');

app.use(cors())
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => res.send("Hangout AI Server"))
app.post("/social-login", ControllerUser.socialLogin)
app.post("/generate", authentication, ControllerUser.generate)
app.get("/chats", authentication, ControllerUser.listOfChat)
app.get("/chats/:id", authentication, ControllerUser.getChatId)
app.post("/chats/:id", authentication, authorization, ControllerUser.updateChatId)

app.use(errorHandler)

app.listen(PORT, () => console.log(`port ${PORT}`))