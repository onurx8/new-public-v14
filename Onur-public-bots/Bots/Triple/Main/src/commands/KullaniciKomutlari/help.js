const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require("discord.js");
const conf = require("../../../../src/configs/sunucuayar.json");
const emoji = require("../../../../src/configs/emojis.json");
const { onurxTik } = require("../../../../src/configs/emojis.json");
const ayar = require("../../../../src/configs/ayarName.json");

module.exports = {
  conf: {
    aliases: ["help", "y", "help", "yardım"],
    name: "yardım",
  },

  run: async (client, message, args, embed, prefix) => {
    let kanallar = ayar.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) 
      return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`})
      .then((e) => setTimeout(() => { e.delete(); }, 10000));

    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      return message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 })) 
        .setDescription(`
        ${onurxTik} **Komut Bilgileri**
        
        🔹 **Komut Adı:** ${command.conf.name}
        🔹 **Kullanım:** ${command.conf.help || "Belirtilmemiş"}
        🔹 **Alternatifler:** ${command.conf.aliases[0] ? command.conf.aliases.join(', ') : `Alternatif bulunmuyor!`}
      `)]});
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('yardım')
          .setPlaceholder('📜 Bir kategori seçin!')
          .addOptions([
            { label: '🧑 Kullanıcı Komutları', value: 'kullanıcı' },
            { label: '📝 Kayıt Komutları', value: 'reg' },
            { label: '⚖️ Cezalandırma Komutları', value: 'ceza' },
            { label: '📊 Stat Komutları', value: 'stats' },
            { label: '🛠️ Yetkili Komutları', value: 'yt' },
            { label: '👑 Kurucu Komutları', value: 'owner' },
            { label: '🤖 Bot Sahibi Komutları', value: 'botsahip' },
            { label: '🎭 Eğlence Komutları', value: 'eglence' },
          ]),
      );

    let msg = await message.reply({ 
      embeds: [
        embed.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
          .setTitle("📜 Komut Yardım Menüsü")
          .setDescription(`
          Aşağıda sunucudaki komut kategorileri listelenmiştir. 
          Toplam **${client.commands.size}** komut mevcuttur.
          Detaylı bilgi için: \`${prefix}yardım <Komut İsmi>\`
          `)
      ], 
      components: [row] 
    });

    const filter = (menu) => menu.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

    collector.on("collect", async (menu) => {
      await menu.deferUpdate();
      
      let category = menu.values[0];
      let categoryMap = {
        "kullanıcı": "kullanıcı",
        "reg": "kayıt",
        "ceza": "cezalandırma",
        "stats": "stat",
        "yt": "yetkili",
        "owner": "yönetim",
        "botsahip": "sahip",
        "eglence": "eglence"
      };

      const selectedCategory = categoryMap[category];
      if (!selectedCategory) return;

      const commandList = client.commands.filter(x => x.conf.category !== "-" && x.conf.category == selectedCategory)
        .map(x => `🔹 \`${prefix}${x.conf.help}\``).join('\n');

      const embeds = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
        .setTitle(`📂 ${menu.values[0].toUpperCase()} Kategorisi`)
        .setDescription(commandList || "❌ Bu kategoride komut bulunmamaktadır.");

      msg.edit({
        embeds: [embeds],
        components: [row]
      });
    });
  }
};
