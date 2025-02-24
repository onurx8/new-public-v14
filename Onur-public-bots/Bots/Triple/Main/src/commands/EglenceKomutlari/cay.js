const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json")

module.exports = {
    conf: {
        aliases: ["çay"],
        name: "çay",
        help: "çay @onurx/ID",
        category: "eglence",
        cooldown: 15
    },
    run: async (client, message, args, embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) {
            await message.react(message.guild.emojiGöster(onurxRed))
            return message.reply({content: "Çay ikram etmek istediğin kişiyi etiketlemelisin! Örnek: .çay @kullanıcı"}).sil(15)
        }
        if(member.id === message.author.id) {
            await message.react(message.guild.emojiGöster(onurxRed))
            return message.reply({content: "Kendine Tekme Atamazsın!"}).sil(15)
        }
        if(member.id === client.user.id) {
            await message.react(message.guild.emojiGöster(onurxRed))
            return message.reply({content: "Bana Çay Veremeszin!"}).sil(15)
        }
        if(member.user.bot) {
            await message.react(message.guild.emojiGöster(onurxRed))
            return message.reply({content: "Botlara Çay Veremeszin!"}).sil(15)
        }
        
        var gifler = [
            "https://media.discordapp.net/attachments/699737284983128075/736252636264923327/19-04-28-261014.jpg",
        ];
        let resimler = gifler[Math.floor(Math.random() * gifler.length)];
        
        embed.setDescription(`>>> ${message.author}, ${member} *kişisine Çay İkram Ediyor.*`)
        embed.setAuthor({name: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true})})
        embed.setColor("Random")
        embed.setThumbnail(member.displayAvatarURL({dynamic: true}))
        embed.setImage(resimler)
        
        message.reply({embeds: [embed], content: (`${member}`)});
    }
}