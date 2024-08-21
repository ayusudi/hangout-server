# Hangout-AI Server

> https://hangout-ai-c81439a5ea16.herokuapp.com

## Documentation
For more information, visit the [documentation](https://hangout-ai-c81439a5ea16.herokuapp.com/docs).

## List Enpoints 

| METHOD | ENDPOINT | AUTH | AUTHZ | DESCRIPTION |
| --- | --- | --- | --- | --- |
| GET | / | | | For check server is running or not |
| POST | /social-login | | | For google login | 
| POST | /generate | TRUE | | For generate itenary |
| GET | /chats | TRUE | | For get list of chat |
| GET | /chats/:id | TRUE | | For get chat messages by id |
| POST | /chats/:id | TRUE | TRUE | For edit messages by id |


## How to run the app locally 
1. npm install all the package 
```bash
npm install 
```
2. fill the .env & config/config.json
3. run app.js 
```bash
npm run start
```

## ENV Template
```
GSIGN_CLIENTID=
GSIGN_CLIENTSECRET=
PORT=
SECRET=
```

## config/config.json
```json
{
  "development": {
    "username": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "database": "YOUR_DM",
    "host": "CHANGETHISGATEWAY.prod.aws.tidbcloud.com",
    "port": "YOUR_PORT",
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "minVersion": "YOUR_MINVERSIION",
        "rejectUnauthorized": true,
        "ca": null
      }
    }
  }
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "database": "YOUR_DM",
    "host": "CHANGETHISGATEWAY.prod.aws.tidbcloud.com",
    "port": "YOUR_PORT",
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "minVersion": "YOUR_MINVERSIION",
        "rejectUnauthorized": true,
        "ca": null
      }
    }
  }
}
```

## Models DB
### User Model

- **`id`**: Primary key, auto-incrementing `INTEGER`.
- **`name`**: User's name (`STRING`).
- **`email`**: User's email (`STRING`).
- **`image`**: User's image (`STRING`).
- **`createdAt`** & **`updatedAt`**: Timestamps (`DATE`), not nullable.

### Chat Model

- **`id`**: Primary key, auto-incrementing `INTEGER`.
- **`name`**: Chat name (`STRING`).
- **`messages`**: Chat messages in JSON format.
- **`address`**: Chat location address (`STRING`).
- **`latitude`** & **`longitude`**: Location coordinates (`STRING`).
- **`UserId`**: Foreign key to `Users` table (`INTEGER`).
- **`createdAt`** & **`updatedAt`**: Timestamps (`DATE`), not nullable.