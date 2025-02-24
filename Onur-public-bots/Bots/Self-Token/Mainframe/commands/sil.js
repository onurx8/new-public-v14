module.exports = {
    Isim: "sil",
    Komut: ["sil"],
    Kullanim: "sil <sayı>",
    Aciklama: "Belirtilen sayıda mesajı siler. (1 ile 100 arasında bir sayı girmelisiniz.)",
    Kategori: "genel",
    Extend: true,

    onRequest(client, message, args) {
        const sayı = parseInt(args[0]);

       
        if (isNaN(sayı) || sayı < 1 || sayı > 100) {
            message.channel.send("Lütfen 1 ile 100 arasında bir sayı girin. <a:bewrk_red:1243888435446681620>")
                .then(msg => {
                    
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                });
            return; 
        }

        message.channel.bulkDelete(sayı)
            .then(deletedMessages => {
                message.channel.send(`**${deletedMessages.size}** mesaj silindi. <a:bewrk_onay:1243888310246445106>`)
                    .then(msg => {
                       
                        setTimeout(() => {
                            msg.delete();
                        }, 5000);
                    });
            })
            .catch(err => {
                console.error(err);
                message.channel.send("Mesajları silerken bir hata oluştu.");
            });
    },
};
