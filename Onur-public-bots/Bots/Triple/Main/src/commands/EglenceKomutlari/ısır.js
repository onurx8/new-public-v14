const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json");

module.exports = {
    conf: {
        aliases: ["ısır"],
        name: "ısır",
        help: "ısır @kullanıcı/ID",
        category: "eglence",
        cooldown: 15
    },
    run: async (client, message, args, embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!member) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("ısırmak istediğin kişiyi etiketlemelisin! Örnek: .iltifat @kullanıcı");
        }

        if (member.id === message.author.id) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("Kendini ısıramazsın Edemezsin!");
        }

        if (member.id === client.user.id) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("Bana İltifat Edemezsin!");
        }

        if (member.user.bot) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("Botlara İltifat Edemezsin!");
        }
        var gifler = [
            "https://images-ext-2.discordapp.net/external/_TfW8mZ6Jd3RH5IFRyanMClUL7YQ4U4eDqRFbCCZSeE/https/cdn.weeb.sh/images/HkutgeXob.gif",
            "https://images-ext-2.discordapp.net/external/vC2Rtik3yWmDUKLC6TrL8qbJc5N0wzuOHOrkL8NP-Qw/https/cdn.weeb.sh/images/rkakblmiZ.gif",
            "https://images-ext-1.discordapp.net/external/5TQYqKzUUVY3FS_xVr0tcPthDqDVCb1_bkBynAXFv98/https/cdn.weeb.sh/images/ByWuR1q1M.gif",
            "https://images-ext-2.discordapp.net/external/IPYZhNo1chPmJU9Fqi773cJT5ubnzumWRpiUV8tPWhQ/https/cdn.weeb.sh/images/rkNgZlXi-.gif",
            "https://images-ext-2.discordapp.net/external/COsmj2xcgJnugMudMHzmELLiQeeLv6360BrsKDfkxW0/https/cdn.weeb.sh/images/ry00lxmob.gif",
            "https://images-ext-1.discordapp.net/external/QXlArNhRqGqvKQVQdmMDLzzM0bo1UnBfw502sW-rgOQ/https/cdn.weeb.sh/images/H1hige7sZ.gif",
            "https://images-ext-1.discordapp.net/external/JoRx_p31x6jJFEifeUUge_zutUUtKeMU980Bw71Akbs/https/cdn.weeb.sh/images/BJXRmfr6-.gif",
            "https://images-ext-1.discordapp.net/external/cI3IB_rF-w6s9iilUoQmbQaYy95vObDuEx0exjET9tQ/https/cdn.weeb.sh/images/H1gYelQjZ.gif",
            "https://images-ext-1.discordapp.net/external/0jBLrwUb_eR6beCWx6HXHT93gtNloNQsdo2cWotQ0BE/https/cdn.weeb.sh/images/HJmbWxmiZ.gif"
        ];
        let resimler = gifler[Math.floor(Math.random() * gifler.length)];
        embed.setDescription(`>>> ${message.author}, ${member} *Kişisini Isırdı.*`);
        embed.setImage(resimler);
        embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ dynamic: true }) });
        embed.setColor("Random");
        embed.setThumbnail(member.displayAvatarURL({ dynamic: true }));
        message.reply({ embeds: [embed], content: (`${member}`) });
    }
}
