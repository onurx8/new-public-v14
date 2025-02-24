const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json")

module.exports = {
   conf: {
       aliases: ["50krs"],
       name: "50krs",
       help: "50krs @onurx/ID", 
       category: "eglence",
       cooldown: 15
   },
   run: async (client, message, args, embed) => {
       const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
       if(!member) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "50 kuruş istemek için birini etiketlemelisin! Örnek: .50krs @kullanıcı"}).sil(15)
       }
       if(member.id === message.author.id) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Kendinden 50 Kuruş İsteyemezsin!"}).sil(15)
       }
       if(member.id === client.user.id) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Benden 50 Kuruş İsteyemezsin!"}).sil(15)
       }
       if(member.user.bot) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Botlardan 50 Kuruş İsteyemezsin!"}).sil(15)
       }

       var gifler = [
           "https://media.discordapp.net/attachments/927961789646393386/929346768225828915/ScratchyMellowAustraliancurlew-size_restricted.gif",
           "https://media.discordapp.net/attachments/927961789646393386/929347804860669962/IMG_20220108_151613.jpg",
           "https://media.discordapp.net/attachments/927961789646393386/929347444783857664/images.jpeg"
       ];
       let resimler = gifler[Math.floor(Math.random() * gifler.length)];

       var soz = [
           "50 Kuruş Lütfen. 🥺",
           "50 Kuruş Ver Tırrek 😡",
           "50 Krş Ver Lan Şirrekk 😸"
       ];
       let sözler = soz[Math.floor(Math.random() * soz.length)];

       embed.setDescription(`>>> ${member} *${sözler}*`)
       embed.setAuthor({name: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true})})
       embed.setColor("Random")
       embed.setThumbnail(member.displayAvatarURL({dynamic: true}))
       embed.setImage(resimler)
       
       message.reply({embeds: [embed], content: (`${member}`)});
   }
}