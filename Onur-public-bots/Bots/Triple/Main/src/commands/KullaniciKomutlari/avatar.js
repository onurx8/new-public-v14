const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require("discord.js");
const axios = require('axios');
const client = global.bot;
const ayar = require("../../../../src/configs/ayarName.json");

module.exports = {
    conf: {
        aliases: ["avatar", "av", "pp"],
        name: "avatar",
        help: "avatar",
        category: "kullanıcı",
    },

    run: async (client, message, args, embed, prefix) => {
        let kanallar = ayar.KomutKullanımKanalİsim;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) {
            return message.reply({
                content: `${kanallar.map(x => `<#${client.channels.cache.find(chan => chan.name === x)?.id}>`).join(", ")} kanallarında kullanabilirsiniz.`
            }).then((e) => setTimeout(() => { e.delete(); }, 10000));
        }

        if (!message.guild) return;

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('banner')
                    .setPlaceholder('Bannerını görüntülemek için tıklayınız!')
                    .addOptions([
                        {
                            label: 'Banner',
                            description: 'Bannerını görüntülemek için tıklayınız ama sapıklık yapma!',
                            value: 'banner',
                        }
                    ]),
            );

        let üye = args.length > 0 
            ? message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null) 
            : message.author;

        if (!üye) {
            return message.reply({ content: "Geçerli bir kullanıcı belirtmelisiniz!", ephemeral: true });
        }

        async function bannerXd(userId, client) {
            try {
                const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, {
                    headers: { Authorization: `Bot ${client.token}` }
                });

                if (!response.data.banner) {
                    return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`;
                }

                const isAnimated = response.data.banner.startsWith("a_");
                const format = isAnimated ? "gif" : "png";
                return `https://cdn.discordapp.com/banners/${userId}/${response.data.banner}.${format}?size=512`;
            } catch (error) {
                console.error("Banner alınırken bir hata oluştu:", error);
                return "Banner alınırken bir hata oluştu.";
            }
        }

        let msg = await message.channel.send({
            content: `${üye.displayAvatarURL({ dynamic: true, size: 4096 })}`,
            components: [row]
        });

        const filter = (menu) => menu.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on("collect", async (menu) => {
            if (menu.values[0] === "banner") {
                let banner = await bannerXd(üye.id, client);
                menu.reply({ content: `${banner}`, ephemeral: true });
            }
        });

        collector.on("end", () => {
            msg.edit({ components: [] }).catch(() => { });
        });
    },
};
