const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const Findcord = require("findcord").default;
const { apiKey } = require("../config.json");

const allowedRoleId = "1229208344598941778";

module.exports = {
  conf: {
    aliases: ["sorgu", "gsorgu"],
    name: "sorgu",
    help: "sorgu <ID>",
    cooldown: 10000,
  },

  run: async (_, message, args) => {
    if (!message.member.roles.cache.has(allowedRoleId)) {
      return message.reply({ content: "Bu komutu kullanma yetkiniz yok!" }).then((msg) => {
        setTimeout(() => msg.delete(), 10000);
      });
    }

    const userId = args[0];
    if (!userId) {
      return message.reply({ content: "Lütfen bir kullanıcı ID'si belirtin!" });
    }

    try {
      const data = new Findcord(apiKey);
      const user = await data.fetch(userId);

      if (!user || !user.username) {
        return message.reply({ content: "Belirtilen ID'ye sahip bir kullanıcı bulunamadı!" });
      }

      const createEmbed = (title = null, description = null) => {
        const embed = new EmbedBuilder()
          .setAuthor({ 
            name: user.username || "Bilinmeyen Kullanıcı",
            iconURL: user.displayAvatarURL({ extension: 'png', size: 1024, dynamic: true })
          })
          .setColor('#2f3136')
          .setTimestamp();

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if(user.avatar) embed.setThumbnail(user.displayAvatarURL({ extension: 'png', size: 4096 }));
        
        return embed;
      };

      const x = {
        mobile: '📱',
        desktop: '🖥️',
        web: '🌐',
      }

      const xa = user?.presence?.clientStatus?.map(w => {
         return x[w]
      })

      const initialEmbed = createEmbed("📌 Kullanıcı Bilgileri", `  
        🏷️ **Adı:** ${user.username}  
        🌍 **Görünen Adı:** ${user.globalName || 'Yok'}  
        🆔 **Kullanıcı ID:** ${userId}  
        📝 **Hakkında:** ${user.bio || 'Belirtilmemiş'}  
        🏳️ **Hitapları:** ${user.pronouns || 'Belirtilmemiş'}  
        🎭 **Durumu:** ${getStatusEmoji(user.presence?.status)} ${user.presence?.status || 'Bilinmiyor'}  
        🖥️ **Cihaz:** ${xa.length > 0 ? xa?.map(x => {return x}) : 'Bilinmiyor'}
    `);

function getStatusEmoji(status) {
    switch (status) {
        case 'online': return '🟢';
        case 'idle': return '🟠';
        case 'dnd': return '🔴';
        case 'offline': return '⚫';
        default: return '❓';
    }
}

      if (user?.banner) {
        const bannerUrl = user.displayBannerURL({ extension: 'png', size: 1024 })
        if (bannerUrl) initialEmbed.setImage(bannerUrl);
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('infoSelect')
        .setPlaceholder('Bilgi kategorisini seçin')
        .addOptions([
          {
            label: 'Kullanıcı Bilgileri',
            description: 'Ana kullanıcı bilgilerini görüntüle',
            value: 'user_info'
          },
          {
            label: 'Yetkili Geçmişi',
            description: 'Yetkili olduğu sunucular ve pozisyonlar',
            value: 'staff_history'
          },
          {
            label: 'Sicil Kayıtları',
            description: 'Kullanıcının tüm sicil kayıtları',
            value: 'records'
          },
          {
            label: 'Sunucu Geçmişi',
            description: 'Bulunduğu sunucular ve kullanıcı adları',
            value: 'server_history'
          },
          {
            label: 'Son Görülme',
            description: 'Kullanıcının en son görüldüğü zaman ve yer',
            value: 'last_seen'
          }
        ]);

      const row = new ActionRowBuilder().addComponents(selectMenu);

      const response = await message.reply({
        embeds: [initialEmbed],
        components: [row],
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 300000
      });

      collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id) {
          return interaction.reply({
            content: 'Bu menüyü sadece komutu kullanan kişi kullanabilir!',
            ephemeral: true
          });
        }

        const value = interaction.values[0];
        let newEmbed;

        switch (value) {
          case 'user_info':
            newEmbed = initialEmbed;
            break;

          case 'staff_history':
            const staffList = user.staffs?.map(staff => 
              `🏷️ **Sunucu İsmi:** ${staff.name || 'Bilinmiyor'}\n` +
              `🆔 **Sunucunun ID:** ${staff.id || "Bilinmiyor"}\n`
            ).join('\n') || "🚫 Yetkili geçmişi bulunamadı";

            newEmbed = createEmbed("📜 Yetkili Geçmişi", staffList);
            break;

            case 'records': 
            const recordList = user.punishments?.map(record => 
              `🌍 **Sunucu:** ${record.guild.name || 'Bilinmiyor'}\n` +
              `⚖️ **Tür:** ${record.data.type || 'Bilinmiyor'}\n` +
              `📜 **Sebep:** ${record.data.reason || 'Belirtilmemiş'}\n` +
              `📅 **Tarih:** ${record.data.timestamp ? moment(record.data.timestamp).format('LLLL') : 'Bilinmiyor'}\n`
            ).join('\n\n') || "✅ Sicil kaydı bulunamadı";
        
            newEmbed = createEmbed("📂 Sicil Kayıtları", recordList);
            break;

            case 'server_history':
              const serverList = user.guilds?.map(server => 
                `🌍 **Sunucu:** ${server.name}\n` +
                `🏷️ **Kullanıcı Adı:** ${server.userDisplayName || 'Bilinmiyor'}`
              ).join('\n\n') || "Sunucu geçmişi bulunamadı";
          
              newEmbed = createEmbed("Sunucu Geçmişi", serverList);
              break;
          

            case 'last_seen':
              const lastSeenInfo = `
                🔊 **Son Katıldığı Ses Kanalı:** \`${user.lastseen.voice.channel.name || 'Bilinmiyor'}\`
                ⏳ **Ses Kanalında Geçirdiği Süre:** ${user.lastseen.voice.stat || 'Bilinmiyor'}
                🕒 **Ses Kanalına Katılma Tarihi:** ${moment(user.lastseen.voice.timestamp, 'DD.MM.YYYY HH:mm:ss').format('LLLL')}\n
                🌍 **Son Mesaj Attığı Sunucu:** ${user.lastseen.message.guild.name || 'Bilinmiyor'}
                📢 **Son Mesaj Attığı Kanal:** ${user.lastseen.message.channel.name || 'Bilinmiyor'}
                🗓️ **Son Mesaj Tarihi:** ${moment(user.lastseen.message.timestamp, 'DD.MM.YYYY HH:mm:ss').format('LLLL')}
                ✉️ **Son Mesaj İçeriği:** ${user.lastseen.message.content || 'Bilinmiyor'}
              `;
              newEmbed = createEmbed("👀 Son Görülme", lastSeenInfo);
              break;
        }

        await interaction.update({
          embeds: [newEmbed],
          components: [row]
        });
      });

      collector.on('end', () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          selectMenu.setDisabled(true)
        );
        response.edit({ components: [disabledRow] }).catch(() => {});
      });

    } catch (error) {
      console.error("Hata:", error);
      message.reply({ 
        content: "Kullanıcı bilgisi alınırken bir hata oluştu. Lütfen geçerli bir ID girin!",
        ephemeral: true
      });
    }
  },
};
