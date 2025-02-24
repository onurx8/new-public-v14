const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json")

module.exports = {
   conf: {
       aliases: ["fal"],
       name: "fal",
       help: "fal",
       category: "eglence",
       cooldown: 15
   },
   run: async (client, message, args, embed) => {
       var gifler = [
           'Hayatında hiç evlenmiceksin, Evliliğe karşı çıkacaksın',
           'Çok göz var sende, ay çok nazar',
           'Son zamanlarda için kabarmış senin', 
           'Çok düşünüyorsun',
           'Görüyorum, hem de çok iyi görüyorum şükürler olsun Allahım bana bunları gösterdiğin için. Havuç ye göze çok iyi geliyor',
           'Bir yolculuk görüyorum yakında, hayırlı olsun şimdiden',
           'Uzaktan gelen bir haber var, dikkatli ol',
           'Kısmetinde büyük bir değişim görüyorum',
           'Senin için dua eden birileri var uzakta',
           'Yakında güzel bir süpriz ile karşılaşacaksın',
           'Bir arkadaşın sana yardım edecek',
           'Maddi sıkıntıların yakında son bulacak',
           'Çevrende çok fazla dedikodu dönüyor, dikkatli ol',
           'Yeni bir iş fırsatı doğacak önüne',
           'Aşk hayatında güzel gelişmeler olacak',
           'Beklemediğin bir yerden para gelecek',
           'Sağlığına dikkat etmelisin bu aralar',
           'Eski bir dostunla karşılaşacaksın',
           'Bir kaybın olacak ama üzülme',
           'Bazı kararlar alman gerekiyor artık',
           'Yeni bir hobiye başlayacaksın',
           'Ailen ile ilgili güzel haberler alacaksın',
           'Uzun zamandır beklediğin bir şey gerçekleşecek',
           'Bir hediye alacaksın',
           'Yeni bir ev alma durumun olabilir',
           'Kariyer değişikliği düşünüyorsun',
           'Eski bir aşkınla karşılaşabilirsin',
           'Uzak bir yerden misafirin gelecek',
           'Rüyalarında gördüğün şey gerçek olabilir',
           'Bir telefon gelecek, hayatın değişecek',
           'Yeni bir araba alabilirsin',
           'Bir akrabanın düğünü var yakında',
           'Bir arkadaşının sırrını öğreneceksin',
           'Eskiden kalan bir borç ödenecek',
           'Beklediğin bir haber gelecek',
           'Yeni bir evcil hayvan sahiplenebilirsin',
           'Bir arkadaşın sana iş teklif edecek',
           'Ailende yeni bir bebek olabilir',
           'Eski bir eşyandan para kazanacaksın',
           'Bir yarışma veya çekilişi kazanabilirsin',
           'Uzaktaki bir akraban ziyarete gelecek',
           'Komşularınla ilgili iyi haberler var',
           'Bir davete katılacaksın',
           'Eskiden tanıdığın biriyle karşılaşacaksın',
           'Sevdiğin birinden güzel bir haber alacaksın',
           'İş hayatında yükselme var',
           'Yeni bir yetenek keşfedeceksin kendinde',
           'Bir seyahate çıkacaksın',
           'Eski bir dostun seni arıyacak',
           'Çevrende yeni insanlarla tanışacaksın',
           'Beklediğin bir proje gerçekleşecek',
           'Maddi durumunda iyileşme olacak',
           'Bir aile büyüğünden miras kalabilir',
           'Yeni bir dil öğrenmeye başlayacaksın',
           'Bir hayalin gerçek olacak',
           'Beklenmedik bir yerden para kazanacaksın',
           'Sağlık problemlerin son bulacak',
           'Eski bir hobine geri döneceksin',
           'Yeni bir ev alacaksın',
           'Bir arkadaşının düğününe gideceksin',
           'Uzun zamandır görmediğin biriyle karşılaşacaksın'
       ];
       let resimler = gifler[Math.floor(Math.random() * gifler.length)];
       
       embed.setTitle(`${message.member.user.username} Bahtına bakalım 🤓`)
       embed.setAuthor({name: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true})})
       embed.setColor("Random")
       embed.setThumbnail(message.member.displayAvatarURL({dynamic: true}))
       embed.setDescription(`*${resimler}*`)
       
       message.reply({embeds: [embed]});
   }
}