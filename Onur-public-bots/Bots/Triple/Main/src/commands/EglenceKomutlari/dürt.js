const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json")

module.exports = {
   conf: {
       aliases: ["dürt"],
       name: "dürt",
       help: "dürt @onurx/ID",
       category: "eglence", 
       cooldown: 15
   },
   run: async (client, message, args, embed) => {
       const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
       if(!member) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Dürtmek istediğin kişiyi etiketlemelisin! Örnek: .dürt @kullanıcı"}).sil(15)
       }
       if(member.id === message.author.id) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Kendini Dürtemezsin!"}).sil(15)
       }
       if(member.id === client.user.id) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Beni Dürtemezsin!"}).sil(15)
       }
       if(member.user.bot) {
           await message.react(message.guild.emojiGöster(onurxRed))
           return message.reply({content: "Botları Dürtemezsin!"}).sil(15)
       }

       embed.setDescription(`*Hey ${member}, ${message.author} Kullanıcısı Sizi Dürttü.*`)
       embed.setAuthor({name: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true})})
       embed.setColor("Random")
       embed.setThumbnail(member.displayAvatarURL({dynamic: true}))
       embed.setImage("https://media.discordapp.net/attachments/930066248291741696/930457259618762752/200.gif")
       embed.setFooter({text: `${message.member.user.username} Dürttü`, iconURL: message.member.user.avatarURL({dynamic: true})})
       
       message.reply({embeds: [embed], content: (`${member}`)})
   }
}