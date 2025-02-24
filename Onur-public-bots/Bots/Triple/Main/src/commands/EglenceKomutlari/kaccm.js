const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json");

module.exports = {
    conf: {
        aliases: ["kaçcm", "kaccm"],
        name: "kaccm",
        help: "kaccm",
        category: "eglence"
    },
    run: async (client, message, args, embed) => {
        let slm = ['2', '4', '8', '12', '15', '20', '1', '0', '24', '26', '32', '38', '41', '54', '60'];
        embed.setDescription(`*Boyutu __${slm[Math.floor(Math.random() * slm.length)]}CM__ 🍆*`);  // Rastgele boyut seçimi
        embed.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ dynamic: true }) });
        embed.setColor("Random");
        embed.setThumbnail(message.member.displayAvatarURL({ dynamic: true }));
        embed.setImage("https://cdn.glitch.com/8e70d198-9ddc-40aa-b0c6-ccb4573f14a4%2Feggplant-transparent-animated-gif-3.gif");

        await message.react(message.guild.emojis.cache.get(onurxTik));  // Doğru emoji gösterimi
        await message.reply({ embeds: [embed] });
    }
};
