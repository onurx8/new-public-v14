const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');


const allowedUserIds = ['833656201623109712', '104780659981041664', '833656201623109712'];  // Kullanıcı ID lerinizi buraya ekleyin

module.exports = {
    Isim: "tokenler",
    Komut: ["tokenler"],
    Kullanim: "tokenler",
    Aciklama: "Token eklemek için butona tıklatır.",
    Kategori: "genel",
    Extend: true,

    kullaniciKullanmaSayisi: {}, 

    onRequest: async function (client, message, args) {
        const userId = message.author.id;

      
        if (!allowedUserIds.includes(userId)) {
            return message.reply("Bu komutu kullanma yetkiniz bulunmuyor.");
        }

        const currentDate = new Date().toDateString();

       
        if (!this.kullaniciKullanmaSayisi[userId]) {
            this.kullaniciKullanmaSayisi[userId] = { count: 0, lastDate: currentDate, singleTokenUsed: 0, multiTokenUsed: 0 };
        }

    
        if (this.kullaniciKullanmaSayisi[userId].lastDate !== currentDate) {
            this.kullaniciKullanmaSayisi[userId] = { count: 0, lastDate: currentDate, singleTokenUsed: 0, multiTokenUsed: 0 };
        }

      
        const roleLimitsForSingleToken = {
            '1286720384950992947': 3, 
            '1286717304280842300': 10, 
            '833656201623109712': 15, 
        };

        const roleLimitsForMultiToken = {
            '1287365311959666738': 5, 
            '1287365392788095017': 8,
            '1287365348135534713': 10, 
        };

       
        const userRoles = message.member.roles.cache.map(role => role.id);
        let singleTokenLimit = 0;
        let multiTokenLimit = 0;

      
        for (const roleId of Object.keys(roleLimitsForSingleToken)) {
            if (userRoles.includes(roleId)) {
                singleTokenLimit = roleLimitsForSingleToken[roleId];
                break;
            }
        }


        for (const roleId of Object.keys(roleLimitsForMultiToken)) {
            if (userRoles.includes(roleId)) {
                multiTokenLimit = roleLimitsForMultiToken[roleId];
                break;
            }
        }

        if (args[0] === 'get_token' && singleTokenLimit === 0) {
            return message.reply("Üzgünüm, '1 Adet Token' ekleyebilmek için yeterli üyelik rolüne sahip değilsiniz.");
        }

        if (args[0] === 'get_multi_token' && multiTokenLimit === 0) {
            return message.reply("Üzgünüm, '5+ Token' ekleyebilmek için yeterli üyelik rolüne sahip değilsiniz.");
        }

       
        if (args[0] === 'get_token') {
            if (this.kullaniciKullanmaSayisi[userId].singleTokenUsed >= singleTokenLimit) {
                return message.reply(`Günlük '1 Adet Token Ekle' kullanım limitini (${singleTokenLimit}) aştınız.`);
            }
            this.kullaniciKullanmaSayisi[userId].singleTokenUsed++; 
        }

 
        if (args[0] === 'get_multi_token') {
            if (this.kullaniciKullanmaSayisi[userId].multiTokenUsed >= multiTokenLimit) {
                return message.reply(`Günlük '5+ Token Ekleyin!' kullanım limitini (${multiTokenLimit}) aştınız.`);
            }
            this.kullaniciKullanmaSayisi[userId].multiTokenUsed++; 
        }

     
        const imagePathToken = path.join(__dirname, '..', 'images', 'tokenornek.png');
        const imagePathMultiToken = path.join(__dirname, '..', 'images', 'ornek.png');

        
        const img1 = await loadImage(imagePathToken);
        const img2 = await loadImage(imagePathMultiToken);

     
        const maxHeight = Math.max(img1.height, img2.height);
        const img1Ratio = img1.width / img1.height;
        const img2Ratio = img2.width / img2.height;

        const img1NewWidth = maxHeight * img1Ratio;
        const img2NewWidth = maxHeight * img2Ratio;

     
        const canvasWidth = img1NewWidth + img2NewWidth;
        const canvasHeight = maxHeight;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

    
        ctx.drawImage(img1, 0, 0, img1NewWidth, maxHeight);
        ctx.drawImage(img2, img1NewWidth, 0, img2NewWidth, maxHeight);

        const combinedImagePath = path.join(__dirname, '..', 'images', 'combined.png');
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(combinedImagePath, buffer);

 
        const embed = new EmbedBuilder()
            .setColor('#FFA500') 
            .setTitle('Sunucunun Ses Kanallarını Aktifleştir 💝')
            .setDescription('**Token eklemek için aşağıdaki butonlara tıklayın ve görselde gösterilen gibi ekleyin**')
            .setImage('attachment://combined.png') 
            .setFooter({ text: 'Copyright © Developed by Bewrq 2024' });
        

    
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('get_token')
                    .setLabel('1 Adet Token Ekle')
                    .setEmoji('1285611707913207873')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('get_multi_token')
                    .setLabel('5+ Token Ekleyin!')
                    .setEmoji('1285611707913207873')
                    .setStyle(ButtonStyle.Danger)
            );

       
        await message.channel.send({
            embeds: [embed],
            components: [row],
            files: [{
                attachment: combinedImagePath,
                name: 'combined.png'
            }]
        });
    },
};
