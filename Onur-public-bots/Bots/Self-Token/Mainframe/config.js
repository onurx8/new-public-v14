const { Client, GatewayIntentBits } = require('discord.js');
const config = {
    token: '', // Buraya bot token   gir canım
    prefix: '+', 
    intents: [
        GatewayIntentBits.Guilds,           
        GatewayIntentBits.GuildMessages,     
        GatewayIntentBits.MessageContent,   
        GatewayIntentBits.GuildMembers 
    ]
};

module.exports = config;
