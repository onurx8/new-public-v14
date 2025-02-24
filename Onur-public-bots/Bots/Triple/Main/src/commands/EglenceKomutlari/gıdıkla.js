const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json")

module.exports = {
   conf: {
       name: "gıdıkla",
       aliases: ["gıdıkla"],
       help: "gıdıkla @onurx/ID",
       category: "eglence",
       cooldown: 15
   },
   run: async (client, message, args, embed) => {
       const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
       if(!member) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Gıdıklamak istediğin kişiyi etiketlemelisin! Örnek: .gıdıkla @kullanıcı"}).sil(15)
       }
       if(member.id === message.author.id) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Kendini Gıdıklayamazsın."}).sil(15)
       }
       if(member.id === client.user.id) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Beni Gıdıklayamazsın."}).sil(15)
       }
       if(member.user.bot) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Botları Gıdıklayamazsın."}).sil(15)
       }

       var gifler = [
           "https://images-ext-2.discordapp.net/external/GDFv8BiX-3yLTY8kRHARBWMcgEYPoIjEd2SIOKwjdyc/https/cdn.weeb.sh/images/Byj7LJmiW.gif",
           "https://images-ext-1.discordapp.net/external/2O1UaL70e3pP4hJTmKD7b8QJNpGIBpVKlGusMZMNJNM/https/cdn.weeb.sh/images/SyQHUy7oW.gif",
           "https://images-ext-2.discordapp.net/external/QLpNwmPdzNOZKPLTRqn8xQ32m_aCMH8xfKoIP2VZFSo/https/cdn.weeb.sh/images/SyGQIk7i-.gif",
           "https://images-ext-2.discordapp.net/external/DUUK34z6ZeUfHb0p46FNNGhYON2qo1Fird4KQ1J1opE/https/cdn.weeb.sh/images/HyPyUymsb.gif",
           "https://images-ext-1.discordapp.net/external/PK8syF9wJGMcQOtjAL75YLD-5fgnmoxqjLykBimasSM/https/cdn.weeb.sh/images/SkmEI1mjb.gif",
           "https://images-ext-1.discordapp.net/external/UNOxVH2owAFlq0kPVXwJphztgvqi5MME78vYwgoCako/https/cdn.weeb.sh/images/rkPzIyQi-.gif",
           "https://images-ext-1.discordapp.net/external/PbtmrOxu_vItyU0DtpcGnYr82EPxRaWMFe0vFpYZHuI/https/cdn.weeb.sh/images/rybRByXjZ.gif",
           "https://images-ext-2.discordapp.net/external/a1MlYq3iTSI4KZZ5VhOHRF9VZ3mTVHfcjcmYVStq0Wk/https/cdn.weeb.sh/images/HyjNLkXiZ.gif",
           "https://images-ext-1.discordapp.net/external/7VM2K7ks_fOxjbvcEgkYJzlzMDhDi-YyZRlc0uxmKYY/https/cdn.weeb.sh/images/H1p0ByQo-.gif",
           "https://images-ext-1.discordapp.net/external/PbtmrOxu_vItyU0DtpcGnYr82EPxRaWMFe0vFpYZHuI/https/cdn.weeb.sh/images/rybRByXjZ.gif",
           "https://images-ext-1.discordapp.net/external/2O1UaL70e3pP4hJTmKD7b8QJNpGIBpVKlGusMZMNJNM/https/cdn.weeb.sh/images/SyQHUy7oW.gif"
       ];
       let resimler = gifler[Math.floor(Math.random() * gifler.length)];

       embed.setDescription(`>>> ${message.author}, ${member} *Kişisini Gıdıkladı.*`)
       embed.setAuthor({name: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true})})
       embed.setColor("Random")
       embed.setThumbnail(member.displayAvatarURL({dynamic: true}))
       embed.setImage(resimler)
       
       message.reply({embeds: [embed], content: (`${member}`)});
   }
}