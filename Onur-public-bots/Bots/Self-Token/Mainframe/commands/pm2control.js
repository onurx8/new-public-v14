const { Client, Message, Formatters } = require("discord.js");
const { exec } = require("child_process");
const config = require('../config'); 

module.exports = {
    Isim: "pm2",
    Komut: ["pm2-controller"],
    Kullanim: "",
    Aciklama: "PM2 kontrol komutlarını çalıştırır.",
    Kategori: "-",
    
    onLoad: function (client) {},

    onRequest: async function (client, message, args) {
        let allowedIds = ["833656201623109712"]; 
        if (!allowedIds.includes(message.author.id)) return message.reply("Bu komutu kullanma izniniz yok.");

        const ls = exec(`pm2 ${args.join(' ')}`);
        
        ls.stdout.on('data', function (data) {
            const arr = data.split('\n').filter(line => line); 
            arr.forEach(element => {
                message.channel.send(Formatters.codeBlock("js", element)); 
            });
        });

        ls.stderr.on('data', function (data) {
            message.channel.send(Formatters.codeBlock("js", `Hata: ${data}`));
        });

        ls.on('close', (code) => {
            message.channel.send(`<a:kylockz_Onay:1287515865025220638> ${code}`);
        });
    }
};
