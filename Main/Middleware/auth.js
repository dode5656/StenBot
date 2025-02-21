//AUTHENTICATION
const userUtils = require('../Functions/userUtils');
const bot = require('../../app.js');

const discord = async (req, res, next) => {

  let token;

  try {
    token = req.header('Authorization').replace('Bearer ', '');
  } catch (e) {
    res.status(401).json({
      error: 'true',
      message: 'Unauthorised: No token provided'
    });
  }

  try {
    await userUtils.checkToken(token).then(discordID => {
      if (!discordID) {
        res.status(401).json({
          error: true,
          message: 'Unauthorized: Cannot find a valid match for your token. Please try generating a new token using the /api command.'
        });
      }
      //Attach user ID and token
      req.token = token;
      req.discordID = discordID;
    });

    next();
  } catch (error) {
    bot.log.post('error', error);
    res.status(400).json({
      error: true,
      message: 'Unauthorized: An error occured. Please contact Stentorian#6969 with a close timestamp of this occurance so the issue can be resolved.'
    });
  }
};

module.exports = {
  discord
};