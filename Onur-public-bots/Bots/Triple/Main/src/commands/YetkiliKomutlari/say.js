const { PermissionsBitField } = require("discord.js");
const conf = require("../../../../src/configs/sunucuayar.json")
const { onurxRed } = require("../../../../src/configs/emojis.json")
const emoji = require("../../../../src/configs/emojis.json")
const allah = require("../../../../../../config.json");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["say"],
    name: "say",
    help: "say",
    category: "yetkili",
  },

  run: async (client, message, args, embed) => {
    if(!conf.staffs.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
    {
      message.react(onurxRed)
      return
    }
    let Tag = conf.tag 

    var takviye = rakam(message.guild.premiumSubscriptionCount)
    var takviyesayı = rakam(message.guild.premiumTier)
    var TotalMember = rakam(message.guild.memberCount)
    var AktifMember = rakam(message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size)
    let tag = `${rakam(message.guild.members.cache.filter(u => u.user.displayName.includes(Tag)).size)}${Tag ? ` (**${Tag}**)` : ""}`
    var sesli = rakam(message.guild.members.cache.filter((x) => x.voice.channel).size)

  const ozi = message.channel.send({ embeds: [embed
               .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
			   .setThumbnail(message.guild.iconURL({ dynamic: true}))
               .setDescription(`
<t:${Math.floor(Date.now() / 1000)}:R> **Tarihli Sunucu Verisi**

\` ❯ \` Şu anda toplam ${sesli} kişi seslide.
\` ❯ \` Sunucuda ${TotalMember} adet üye var (**${AktifMember}** Aktif)
\` ❯ \` Toplamda ${tag} kişi tagımızı alarak bizi desteklemiş.
\` ❯ \` Toplamda ${takviye} adet boost basılmış!
`)
           ]})
 },
 };

 function rakam(sayi) {
  var basamakbir = sayi.toString().replace(/ /g, "     ");
  var basamakiki = basamakbir.match(/([0-9])/g);
  basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
  if (basamakiki) {
    basamakbir = basamakbir.replace(/([0-9])/g, d => {
      return {
        '0':  `${emoji.onurx0}`,
        '1':  `${emoji.onurx1}`,
        '2':  `${emoji.onurx2}`,
        '3':  `${emoji.onurx3}`,
        '4':  `${emoji.onurx4}`,
        '5':  `${emoji.onurx5}`,
        '6':  `${emoji.onurx6}`,
        '7':  `${emoji.onurx7}`,
        '8':  `${emoji.onurx8}`,
        '9':  `${emoji.onurx9}`
      }
      [d];
    })
  }
  return basamakbir;
}