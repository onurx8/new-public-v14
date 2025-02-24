const { ButtonStyle, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json");

module.exports = {
    conf: {
        aliases: ["sil", "temizle"],
        name: "sil",
        help: "sil",
        category: "yönetim",
    },

    run: async (client, message, args, embed) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        
        if (args[0] && args[0] < 101 && args[0] > 0 && !isNaN(args[0])) {
            await message.delete();
            let fetchedMessages = await message.channel.messages.fetch({ limit: args[0] });

            let oldMessages = fetchedMessages.filter(msg => (Date.now() - msg.createdTimestamp) >= 1209600000); // 14 gün ve üstü
            let newMessages = fetchedMessages.filter(msg => (Date.now() - msg.createdTimestamp) < 1209600000); // 14 günden yeni

            if (newMessages.size > 0) await message.channel.bulkDelete(newMessages, true);

            for (const msg of oldMessages.values()) {
                await msg.delete().catch(() => {});
            }

            message.channel.send({ content: `${onurxTik} ${fetchedMessages.size} adet mesaj silindi.` })
                .then((e) => setTimeout(() => { e.delete(); }, 5000));

        } else {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("on").setLabel("10").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("yirmibes").setLabel("25").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("elli").setLabel("50").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("yüz").setLabel("100").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("iptal").setLabel("X").setStyle(ButtonStyle.Danger)
            );

            let ozi = new EmbedBuilder()
                .setDescription(`\` ➥ \` **Kaç adet mesaj sileceğinizi butonlar ile seçiniz.**`)
                .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL({ dynamic: true }) });

            let msg = await message.channel.send({ embeds: [ozi], components: [row] });

            var filter = (button) => button.user.id === message.author.id;
            let collector = await msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on("collect", async (button) => {
                let amount = 0;
                if (button.customId === "on") amount = 10;
                if (button.customId === "yirmibes") amount = 25;
                if (button.customId === "elli") amount = 50;
                if (button.customId === "yüz") amount = 99;

                if (amount > 0) {
                    await message.delete();
                    let fetchedMessages = await message.channel.messages.fetch({ limit: amount });

                    let oldMessages = fetchedMessages.filter(msg => (Date.now() - msg.createdTimestamp) >= 1209600000);
                    let newMessages = fetchedMessages.filter(msg => (Date.now() - msg.createdTimestamp) < 1209600000);

                    if (newMessages.size > 0) await message.channel.bulkDelete(newMessages, true);

                    for (const msg of oldMessages.values()) {
                        await msg.delete().catch(() => {});
                    }

                    message.channel.send({ content: `${onurxTik} ${fetchedMessages.size} adet mesaj silindi!` })
                        .then((e) => setTimeout(() => { e.delete(); }, 5000));
                }

                if (button.customId === "iptal") {
                    await message.delete();
                    msg.edit({ content: `${onurxRed} Mesaj silme işleminden vazgeçtiniz.`, embeds: [], components: [] })
                        .then((e) => setTimeout(() => { e.delete(); }, 5000));
                }
            });
        }
    },
};
