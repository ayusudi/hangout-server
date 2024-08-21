const axios = require("axios")
const { signPayloadIntoToken } = require("../helpers/jwt")
const { User, Chat } = require("../models")
class ControllerUser {
  static async socialLogin(req, res, next) {
    try {
      try {
        let { access_token } = req.body
        if (!access_token) throw "INVALID_USER"
        // Verify the token with Google API
        const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
        const { email, name, picture: image } = googleResponse.data;
        const data = await User.findOne({ where: { email } })
        if (data) {
          let payload = { id: data.id, email }
          let accessToken = signPayloadIntoToken(payload)
          let user = { ...data.dataValues }
          return res.status(200).json({ access_token: accessToken, user })
        }
        let dataCreate = await User.create({ name, email, image })
        let user = { ...dataCreate.dataValues }
        let payload = { id: user.id, email }
        let token = signPayloadIntoToken(payload)
        return res.status(201).json({ access_token: token, user })
      } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'Failed to verify token' });
      }
    } catch (error) {
      next(error)
    }
  }
  static async listOfChat(req, res, next) {
    try {
      let chats = await Chat.findAll({
        where: {
          UserId: req.user.id
        },
        attributes: ['id', 'name', 'createdAt']
      })
      res.status(200).json(chats)
    } catch (error) {
      next(error)
    }
  }
  static calculateDuration(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;
    // If the end time is less than the start time, it means the end time is on the next day.
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60;
    }
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const durationHours = Math.floor(durationMinutes / 60);
    const remainingMinutes = durationMinutes % 60;
    if (remainingMinutes === 0) {
      return `${durationHours} hours`;
    } else {
      return `${durationHours} hours and ${remainingMinutes} minutes`;
    }
  }

  static async generate(req, res, next) {
    try {
      let { startTime, endTime, location, date, address, latlng } = req.body
      let code = {
        "Jakarta": "ID",
        "Singapore": "SG",
        "Kuala Lumpur": "MY"
      }
      let country = code[location]
      let day = new Date(date).toLocaleDateString('en-EN', {
        weekday: 'long',
      })

      const config = {
        method: 'get',
        url: 'https://hangout.llm.api.laam.my.id',
        maxBodyLength: Infinity,
        headers: {
          'accept': 'application/json'
        },
        params: {
          day,
          country,
          startTime,
          endTime,
          address: address || "Buaran Plaza"
        }
      };
      let { data } = await axios(config)
      const { response, metadata } = data
      let duration = ControllerUser.calculateDuration(startTime, endTime)
      let promptSystem = {
        role: "user",
        content: `### Itenary Preference \n- Location: ${location}\n- Date: ${date}\n- Time: ${startTime} - ${endTime} (${duration})`,
        latlng
      }
      let name = `${location},${new Date(date).toLocaleDateString('en-GB')},${startTime},${endTime}`
      let list = metadata.map(el => {
        return {
          cid: el.cid,
          name: el.title
        }
      })
      let chat = await Chat.create({
        name,
        latitude: latlng.lat,
        longitude: latlng.lng,
        address,
        UserId: req.user.id,
        messages: [
          promptSystem,
          {
            role: "assistant",
            content: response,
            metadata: list
          }
        ]
      })
      res.status(201).json(chat)
    } catch (error) {
      next(error)
    }
  }
  static async getChatId(req, res, next) {
    try {
      let data = await Chat.findByPk(req.params.id)
      if (!data) throw { name: "NOT_FOUND" }
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
  static async updateChatId(req, res, next) {
    try {
      let messages = req.body.messages
      let flag = true
      messages.forEach(el => {
        if (!el.content || !el.role) {
          flag = false
        }
      })
      if (flag) {
        await Chat.update({
          messages
        }, {
          where: {
            id: req.params.id
          }
        })
        let chat = await Chat.findByPk(req.params.id)
        res.status(200).json(chat)
      } else {
        throw { code: 400, msg: "Bad Request" }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ControllerUser