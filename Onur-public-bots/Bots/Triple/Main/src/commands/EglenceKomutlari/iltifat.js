const { onurxTik, onurxRed } = require("../../../../src/configs/emojis.json");

module.exports = {
    conf: {
        aliases: ["iltifat"],
        name: "iltifat",
        help: "iltifat @onurx/ID",
        category: "eglence",
        cooldown: 15
    },
    run: async (client, message, args, embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!member) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("İltifat etmek istediğin kişiyi etiketlemelisin! Örnek: .iltifat @kullanıcı");
        }

        if (member.id === message.author.id) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("Kendine İltifat Edemezsin!");
        }

        if (member.id === client.user.id) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("Bana İltifat Edemezsin!");
        }

        if (member.user.bot) {
            await message.react(message.guild.emojis.cache.get(onurxRed));  // Emojiyi doğru şekilde göster
            return message.reply("Botlara İltifat Edemezsin!");
        }


       const iltifatlar = [
           "Gözlerindeki derinlik okyanusları kıskandırıyor.",
           "Gülüşün güneş gibi, etrafına ışık saçıyor.",
           "Senin kalbin altın gibi değerli.",
           "Varlığın bile insanları mutlu etmeye yetiyor.",
           "Sen yürüyen bir şiir gibisin.",
           "Karakterin bir elmas kadar değerli.",
           "Seninle geçen her an bir hazine gibi.",
           "Sen bir sanat eseri gibi eşsizsin.",
           "Senin gibi biri olmak için yarışır yıldızlar.",
           "Gülüşün kış ortasında açan bir çiçek gibi.",
           "Sesin en güzel melodilerden daha hoş.",
           "Senin zekân ve esprilerin bambaşka.",
           "Yaydığın pozitif enerji herkesi etkiliyor.",
           "Sen bir gökkuşağı gibi renk katıyorsun hayata.",
           "Karakter güzelliğin görsel güzelliğini bile geçiyor.",
           "Senin yanında zaman su gibi akıp gidiyor.",
           "Varlığın başlı başına bir mutluluk sebebi.",
           "Sen yürüyen bir neşe kaynağısın.",
           "Enerjin ve pozitifliğin bulaşıcı.",
           "Senin gibi arkadaşı olan çok şanslı.",
           `Mavi gözlerin, gökyüzü oldu dünyamın.`,
`Seni gören kelebekler, narinliğin karşısında mest olur.`,
`Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.`,
`Sabah olmuş. Sen mi uyandın yoksa gönlüme güneş mi doğdu.`,
`Huzur kokuyor geçtiğin her yer.`,
`En güzel manzaramsın benim, seyretmeye doyamadığım.`,
`Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.`,
`Gözlerinin hareketi bile yeter  benim aklımı başımdan almaya.`,
`Seni kelimeler ile anlatmak çok zor. Muhteşem desem yine eksik kalıyor anlamın.`,
`Güller bile kıskanır seni gördükleri zaman kendi güzelliklerini.`,
`Hiç yazılmamış bir şiirsin sen, daha önce eşi benzeri olmayan`,
`Bu kadar muhteşem olamaz bir insan. Bu kadar kusursuz bu kadar mükemmel.. Kirpiklerinin dizilişi bile sırayla senin.`,
`O dudakların bana değse keşke.`,
`Lütfen kalbimde kal orası sana ait gitmeye hakkın yok`,
`Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.`,
`Denize kıyısı olan şehrin huzuru birikmiş yüzüne.`,
`Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.`,
`Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.`,
`Ne tatlısın sen öyle. Akşam gel de iki bira içelim.`,
`Bir gamzen var sanki cennette bir çukur.`,
`Gecemi aydınlatan yıldızımsın.`,
`Ponçik burnundan ısırırım seni`,
`Bu dünyanın 8. harikası olma ihtimalin?`,
`fıstık naber?`,
`Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?`,
`Süt içiyorum yarım yağlı, mutluluğum sana bağlı.`,
`Müsaitsen aklım bu gece sende kalacak.`,
`Gemim olsa ne yazar liman sen olmadıktan sonra...`,
`Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.`,
`Sabahları görmek istediğim ilk şey sensin.`,
`Mutluluk ne diye sorsalar- cevabı gülüşünde ve o sıcak bakışında arardım.**`,
`Bir sahil kasabasının huzuru birikmiş yüzüne`,
`Sen benim düşlerimin surete bürünmüş halisin`,
`Hiç yazılmamış bir şiirsin sen, daha önce eşi benzeri olmayan.`,
`Bu kadar muhteşem olamaz bir insan. Bu kadar kusursuz bu kadar mükemmel.. Kirpiklerinin dizilişi bile sırayla senin.`,
`Adım şaire çıktı civarda. Kimse senin şiir olduğunun farkında değil henüz`,
`Etkili gülüş kavramını ben senden öğrendim`,
`Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.`,
`Bir gamzen var sanki cennette bir çukur.`,
`Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan`,
`Telaşımı hoş gör, ıslandığım ilk yağmursun.`,
`Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.`,
"Ne yaparsan yap, sen her zaman çok doğalsın.",
"Sen, tanıdığım en cesur insansın. Keşke senin gibi olabilseydim.",
"Sen tanıdığım en tatlı insansın.",
"Seninle konuşmak, ferah bir nefes almak gibidir.",
"Bugün harika iş çıkardın. Seninle çalışmayı çok seviyorum.",
"Enerjinin bulaşıcı olduğunu kendi gözlerimle gördüm. Sen mükemmel bir insansın.",
"O kadar nazik ve anlayışlısın ki etrafındaki herkesi daha iyi bir insan yapmayı başarıyorsun.",
"Keşke senin kadar mükemmel bir insan olabilseydim.",
"Yaratıcılığın çok yüksek bir seviyede.",
"İnsanlara güvenmeni seviyorum. Bu anlayışının bir kısmını bana gönderir misin?",
"Ünlü olduğun zaman, hayran kulübünün tek başkanı olmak istiyorum.",
"Çocuklarına çok iyi örnek oluyorsun. Her şeyi doğru yapmana bayılıyorum.",
"Sen yeri doldurulamaz bir insansın.",
"Farkında olduğundan daha harikasın.",
"Senin gibi bir arkadaşımın olması özel hissetmeme neden oluyor.",
"Beni hiçbir zaman hayal kırıklığına uğratmıyorsun. Ne olursa olsun sana güvenebileceğimi biliyorum.",
"Makyaja ihtiyacın yok. Zaten doğal olarak çok güzelsin.",
"Uyurken ne kadar güzel göründüğünü bilsen, kendini izlemek istersin.",
"Harika bir tarzın var. Keşke dolabını birkaç gün kullanabilseydim.",
"Herkesin hayatında olması gereken senin gibi bir arkadaşa ihtiyacı vardır. Sen mükemmel bir insansın.",
"Saçların deniz kızının saçları gibi görünüyor. Çok güzeller.",
"Sen masallardaki prenseslerin gerçek hayat versiyonu olabilirsin.",
"Seni her gördüğümde daha da güzelleşmeyi nasıl başardığına anlam veremiyorum.",
"Bir derginin kapağının en güzel resmi gibisin.",
"İnsanların şarkı yazarken ilham aldığı türden bir insansın.",
"Gülümsemen benim en sevdiğim görüntü olabilir.",
"Sen, her erkeğin sahip olmayı isteyeceği karakterde bir kızsın. Çok özelsin.",
"Gözlerine bakmaktan asla vazgeçmek istemiyorum.",
"Senin yanımda olduğun zaman kendimi çok şanslı hissediyorum.",
"Kötü bir fotoğrafın olamaz; çünkü sen muhteşemsin.",
"Bütün gözlerin sadece senin üzerinde olmasını hak ediyorsun. Çok güzelsin.",
"O kadar tatlı görünüyorsun ki seni hemen yiyebilirim.",
"Keşke bu hayatta senin gibi daha çok insan olsaydı. Hayat, o zaman daha anlamlı olurdu.",
"Milyonda bir gibisin ve iyi ki hayatımdasın.",
"Bu yaşıma kadar gördüğüm en güzel gülümsemeye sahipsin.",
"Her zaman yanımda olmandan gurur duyuyorum.",
"Dünyanın en iyi yemeklerini sadece sen yapıyorsun.",
"Senin gibi bir anneyi herkes hak ediyor. Çok şanslıyım.",
"Senin kadar düşünceli biri ile tanıştığım için çok mutluyum."
       ];

       const secilenIltifat = iltifatlar[Math.floor(Math.random() * iltifatlar.length)];

       embed.setDescription(`>>> ${message.author}, ${member} kişisine: *${secilenIltifat}*`)
       embed.setAuthor({name: message.member.user.username, iconURL: message.member.user.avatarURL({dynamic: true})})
       embed.setColor("Random")
       embed.setThumbnail(member.displayAvatarURL({dynamic: true}))
       
       message.reply({embeds: [embed], content: (`${member}`)});
   }
}