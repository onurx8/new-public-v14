const { Client, Message } = require("discord.js");
const { exec } = require("child_process");
const config = require('../config'); 

module.exports = {
    Isim: "token-restart",
    Komut: ["t-r", "trest"],
    Kullanim: "",
    Aciklama: "Tokenleri yeniden başlatır.",
    Kategori: "-",
    
    onLoad: function (client) {},

    onRequest: async function (client, message, args) {
        if (message.author.id !== config.ownerId) {
            return message.reply({ content: "Bu komutu kullanma izniniz yok." });
        }

        let load = await message.reply({ content: `Tokenler yeniden başlatılırken. Lütfen bekleyin.` });
        const ls = exec(`pm2 restart Controller`);

        ls.stdout.on('data', function (data) {
            load.edit({ content: `Başarıyla ses tokenleri yeniden başlatıldı.` })
            .then(x => {
                message.react('✅').catch(err => {});
                setTimeout(() => {
                    x.delete().catch(err => {});
                }, 7500);  
            });
        });

        ls.stderr.on('data', function (data) {
            load.edit({ content: `Hata: ${data}` })
            .then(x => {
                message.react('❌').catch(err => {});
                setTimeout(() => {
                    x.delete().catch(err => {});
                }, 7500);  
            });
        });
    }
};
