const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Guild = require("../models/guild");
const User = require("../models/user");
const { Message } = require("discord.js");

/** 

GUILD FUNCTIONS

**/
//Create a new guild in the database
const createGuild = async (data) => {
    const guild = new Guild(data);
    await guild.save();
    return guild;
    /*
    EXAMPLE
    bot.mutils.createGuild({
    guild_id: "123456789",
    guild_name: "Example",
    guild_owner_id: "123456789",
    blacklisted: false,
    welcomer_enabled: false,
    welcomer_channel: "123456789",
    welcomer_message: "Hello there",
    userjoin_enabled: false,
    userjoin_role: "123456789",
    userjoin_nickname: "Joe",
    staff_role: "123456789",
    staff_admin: false,
    staff_linkblock: false,
    staff_filter: ["penis"],
    staff_autoban: "",
    logging_enabled: false,
    logging_channel: "123456789",
    logging_level: "medium",
    tickets_enabled: false,
    tickets_message: "Hello",
    music_enabled: false,
    levelling_enabled: false
    });
    */
};

//Fetches all guilds from the database
const getAllGuilds = async () => {
    const guilds = await Guild.find({});
    return guilds;
    /*
    EXAMPLE
    bot.mutils.getAllGuilds().then(data => {console.log(data)})
    */
};

//Fetch guild by id
const getGuildById = async (id) => {
    const guild = await Guild.findOne({guild_id: id});
    return guild;
    /*
    EXAMPLE
    bot.mutils.getGuildById(1234567892).then(data => {console.log(data)})
    */
};

//Fetch guild by name
const getGuildByName = async (name) => {
    const guild = await Guild.findOne({guild_name: name});
    return guild;
    /*
    EXAMPLE
    bot.mutils.getGuildByName("Example").then(data => {console.log(data)})
    */
};

//Delete guild by id
const deleteGuildById = async (id) => {
    await Guild.findOneAndDelete({guild_id: id});
    /*
    EXAMPLE
    bot.mutils.deleteGuildById(123456789)
    */
};

//Delete guild by name
const deleteGuildByName = async (name) => {
    await Guild.findOneAndDelete({guild_name: name});
    /*
    EXAMPLE
    bot.mutils.deleteGuildByName("Example")
    */
};

//Update guild by id
const updateGuildById = async (id, data) => {
    const guild = await getGuildById(id);
    const updates = Object.keys(data);
    updates.forEach(update => guild[update] = data[update]);
    await guild.save();
    return guild;
    /*
    EXAMPLE
    bot.mutils.updateGuildById(123456789, { blacklisted: true }).then(guild => console.log(guild))
    */
};

//Update guild by name
const updateGuildByName = async (name, data) => {
    const guild = await getGuildByName(name);
    const updates = Object.keys(data);
    updates.forEach(update => guild[update] = data[update]);
    await guild.save();
    return guild;
    /*
    EXAMPLE
    bot.mutils.updateGuildByName("Example", { blacklisted: false }).then(guild => console.log(guild))
    */
};

/** 

USER FUNCTIONS

**/
// Password Hashing Function
const genAuthToken = async function () {
    const select = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890?&!£$%#-";
    let token = "";
    for (let x=0; x <= 35; x++) { 
        let ranInt = Math.floor(Math.random() * 62);
        token = token.concat(select[ranInt]);
    }
    let hashedToken = await bcrypt.hash(token, 12);
    
    let data = {
        token: token,
        hashedToken: hashedToken
    }
    return (data);
};

// Create a user
const createUser = async (id) => {
    let authToken;
    let normalToken;
    await genAuthToken().then(data => {
        authToken = data.hashedToken;
        normalToken = data.token
    });
    //Check if user already has a token
    if(await User.findOne({discordID: id})) {
        let normalToken = "User already exists in the database. If you believe this is an error, please contact Stentorian#9524";
        return normalToken;
    }
    //Check if token already exists in database
    if(await User.findOne({token: authToken})) {
        await genAuthToken().then(data => {
            authToken = data.hashedToken;
            normalToken = data.token
        });
    } else {
        const data = {
            discordID: id,
            token: authToken 
        };
        const user = new User(data);
        await user.save();
        return (user, normalToken);
    }
    /* 
    EXAMPLE
    bot.createUser(583374339626238107).then(user => console.log(user));
    */
};

//Match Token and Return User ID
const checkToken = async (token) => {
    let hashedToken = await bcrypt.hash(token, 12);
    let profile = User.findOne({token: hashedToken});
    let discordID;
    if(!profile) discordID = 0
    else discordID = profile.discordID
    return discordID;
    /*
    EXAMPLE
    bot.checkToken("KJ0pWV8R95kZ5pJfySVGIPeEnT7TL6ScfO1G").then(discordID => console.log(discordID));
    */
}

module.exports = { createGuild, getAllGuilds, getGuildById, getGuildByName, deleteGuildById, deleteGuildByName, updateGuildById, updateGuildByName, createUser, checkToken }