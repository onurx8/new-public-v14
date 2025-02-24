const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.conf.name, command);
}

client.once("ready", () => {
  console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(".") || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.conf.aliases && cmd.conf.aliases.includes(commandName));

  if (!command) return;

  try {
    await command.run(client, message, args);
  } catch (error) {
    console.error("Komut çalıştırılırken hata oluştu:", error);
    message.reply({ content: "Komut çalıştırılırken bir hata oluştu!" }).then(msg => {
      setTimeout(() => msg.delete(), 10000);
    });
  }
});

client.login(token);