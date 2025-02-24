const { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    Isim: "paket",
    Komut: ["paket", "pakettanımla"],
    Kullanim: ".paket <@kullanıcı | kullanıcı ID>",
    Aciklama: "Paket tanımlama menüsü açar.",
    Kategori: "genel",
    Extend: true,

    async onRequest(client, message, args) {
        const allowedGuildId = '778642129865277470'; //Sunucu ıd baro kardesim
        const allowedRoleIds = ['1229208344598941778', '1284053960205926421', '1286718642805018635', '1287702750544531490']; //komutu kullancak roller


        if (message.guild.id !== allowedGuildId) {
            return message.reply({ content: 'Bu komut yalnızca belirtilen sunucuda çalışabilir!', ephemeral: true });
        }

        const hasRequiredRole = allowedRoleIds.some(roleId => message.member.roles.cache.has(roleId));
        if (!hasRequiredRole && !message.member.permissions.has('Administrator')) {
            const warningMessage = await message.reply({ content: 'Bu komutu kullanmak için gerekli role veya yönetici iznine sahip değilsiniz! <a:bewrk_red:1243888435446681620>', ephemeral: true });
            setTimeout(() => warningMessage.delete(), 3000);
            return;
        }

        const roles = [
            { label: 'Aura +MVIP Paket', value: '1229208344598941778', level: 5 },
            { label: 'Aura MVIP Paket', value: '1287365311959666738', level: 4 },
            { label: 'Aura +VIP Paket', value: '1287365348135534713', level: 3 },
            { label: 'Aura VIP Paket', value: '1286717304280842300', level: 2 },
            { label: 'Aura Stabil Paket', value: '1288035778009628692', level: 1 },
        ];

     
        const member = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

  
        if (!member) {
            const warningMessage = await message.reply({ content: 'Lütfen bir kullanıcı etiketleyin veya kullanıcı ID\'sini girin! <a:bewrk_red:1243888435446681620>', ephemeral: true });
            setTimeout(() => warningMessage.delete(), 3000); 
            return;
        }


        const currentRole = roles.find(role => member.roles.cache.has(role.value));
        const currentRoleLabel = currentRole ? currentRole.label : 'Henüz bir pakete sahip değil.';

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Paket Tanımlama Menüsü')
            .setDescription(`Aşağıdan bir paket seçin ve işlemi tamamlamak için butonları kullanın.\n\n**Seçilen Kullanıcı:** <@${member.id}>\n\n`
                + '**<a:berq:1287506662311067781> 5. Paketimiz <@&1287365392788095017>**  \n'
                + '**Özellikler:**  <:adasd:1287739928687415318>   \n'
                + '• **1 Adet Tekli Token Ekleme Sistemi Kullanım Hakkı:**  **30 token** ekleyerek işlemlerinizi **esnek** ve **hızlı** gerçekleştirin.  \n'
                + '• **Birden Fazla Token Ekleme İmkanı:**  Günlük toplam **10 Kullanım Hakkı** ile işlemlerinizi **kolay** hale getirin.  \n'
                + '• **Yeni Gelen Güncellemelerden Yararlanma:**  Bu paketle birlikte, sistemdeki en son güncellemeleri anında kullanma fırsatına sahip olun.  \n\n'
                + '**<a:berq:1287506662311067781> 4. Paketimiz <@&1287365311959666738>**  \n'
                + '**Özellikler:**  <:adasd:1287739928687415318>   \n'
                + '• **1 Adet Tekli Token Ekleme Sistemi Kullanım Hakkı:**  **25 token** ekleyerek işlemlerinizi **esnek** ve **hızlı** gerçekleştirin.  \n'
                + '• **Birden Fazla Token Ekleme İmkanı:**  Günlük toplam **8 Kullanım Hakkı** ile işlemlerinizi **kolay** hale getirin.  \n'
                + '• **Yeni Gelen Güncellemelerden Yararlanma:**  Bu paketle birlikte, sistemdeki en son güncellemeleri anında kullanma fırsatına sahip olun.  \n\n'
                + '**<a:berq:1287506662311067781> 3. Paketimiz <@&1287365348135534713>**  \n'
                + '**Özellikler:**  <:adasd:1287739928687415318>   \n'
                + '• **1 Adet Tekli Token Ekleme Sistemi Kullanım Hakkı:**  **20 token** ekleyerek işlemlerinizi **esnek** ve **hızlı** gerçekleştirin.  \n'
                + '• **Birden Fazla Token Ekleme İmkanı:**  Günlük toplam **5 Kullanım Hakkı** ile işlemlerinizi **kolay** hale getirin.  \n\n'
                + '**<a:berq:1287506662311067781> 2. Paketimiz <@&1286717304280842300>**  \n'
                + '**Özellikler:**  <:adasd:1287739928687415318>   \n'
                + '• **1 Adet Tekli Token Ekleme Sistemi Kullanım Hakkı:**  **15 token** ekleyerek işlemlerinizi **esnek** ve **hızlı** gerçekleştirin.  \n\n'
                + '**<a:berq:1287506662311067781> 1. Paketimiz <@&1288035778009628692>**  \n'
                + '**Özellikler:**  <:adasd:1287739928687415318>   \n'
                + '• **1 Adet Tekli Token Ekleme Sistemi Kullanım Hakkı:**  **10 token** ekleyerek işlemlerinizi **esnek** ve **hızlı** gerçekleştirin.  \n\n'
                + `**Güncel Paket:** ${currentRoleLabel}`
            );

        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('roleSelect')
                    .setPlaceholder('Bir Paket Seçin.')
                    .addOptions(
                        roles.map(role => ({
                            label: role.label,
                            value: role.value,
                            emoji: { id: '1285611707913207873' },
                        }))
                    )
            );

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yukselt')
                    .setLabel('Paket Yükselt')
                    .setEmoji('1181651121761177762')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('dusur')
                    .setLabel('Paket Düşür')
                    .setEmoji('1181651058657857586')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('kapat') 
                    .setLabel('Paneli Kapat')
                    .setEmoji('1288096415163220041')
                    .setStyle(ButtonStyle.Secondary) 
            );

        const msg = await message.channel.send({ embeds: [embed], components: [selectMenu, buttonRow] });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            const currentRole = roles.find(role => member.roles.cache.has(role.value));

        
            async function removeAllPackages() {
                for (const role of roles) {
                    if (member.roles.cache.has(role.value)) {
                        await member.roles.remove(role.value);
                    }
                }
            }

            if (interaction.isStringSelectMenu()) {
                const selectedRole = roles.find(role => role.value === interaction.values[0]);

           
                await removeAllPackages();

            
                await member.roles.add(selectedRole.value);
                await interaction.reply({ content: `**${selectedRole.label} Paketi** <@${member.id}> tanımlandı!`, ephemeral: true });

            
                await msg.delete();
            } else if (interaction.isButton()) {
                if (interaction.customId === 'yukselt') {
                    const selectedRole = roles.find(role => member.roles.cache.has(role.value) && role.level < 5);
                    if (selectedRole) {
                        const nextRole = roles.find(role => role.level === selectedRole.level + 1);
                        if (nextRole) {
                            await removeAllPackages();
                            await member.roles.add(nextRole.value);
                            await interaction.reply({ content: `**${nextRole.label} Paketi** <@${member.id}> kullanıcısına tanımlandı!`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: `<@${member.id}> zaten en yüksek pakete sahipsin!`, ephemeral: true });
                        }
                    } else {
                        await interaction.reply({ content: `<@${member.id}>'de tanımlı bir paket yok!`, ephemeral: true });
                    }
                } else if (interaction.customId === 'dusur') {
                    const selectedRole = roles.find(role => member.roles.cache.has(role.value) && role.level > 1);
                    if (selectedRole) {
                        const prevRole = roles.find(role => role.level === selectedRole.level - 1);
                        if (prevRole) {
                            await removeAllPackages();
                            await member.roles.add(prevRole.value);
                            await interaction.reply({ content: `**${prevRole.label} Paketi** <@${member.id}> kullanıcısına tanımlandı!`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: `<@${member.id}> zaten en düşük pakete sahip!`, ephemeral: true });
                        }
                    } else {
                        await interaction.reply({ content: `<@${member.id}>'de tanımlı bir paket yok!`, ephemeral: true });
                    }
                } else if (interaction.customId === 'kapat') {
                    await interaction.reply({ content: 'Panel kapatıldı.', ephemeral: true });
                    collector.stop();
                    await msg.delete();
                }
            }
        });

        collector.on('end', async () => {
            await msg.delete(); 
        });
    }
};
