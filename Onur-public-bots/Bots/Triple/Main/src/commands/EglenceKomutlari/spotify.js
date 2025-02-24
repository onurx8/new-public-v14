const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js");
const { Classic } = require("musicard");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    conf: {
        aliases: ["spo", "spotify", "sp", "spoti"],
        name: "spotify",
        help: "spotify",
        category: "eglence",
    },

    run: async (client, message, args) => {
        const üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if (üye.user.bot) return;

        // Eger kullanici Spotify dinliyorsa
        if (üye.presence && üye.presence.activities.some(x => x.name === "Spotify" && x.type === ActivityType.Listening)) {
            const presence = üye.presence.activities.find(x => x.name === "Spotify");
            const baslangicZamani = presence.timestamps.start;
            const bitisZamani = presence.timestamps.end;
            const gecenSure = moment.duration(Date.now() - baslangicZamani).asMilliseconds();
            const toplamSure = moment.duration(bitisZamani - baslangicZamani).asMilliseconds();

            const formatliSure = `${Math.floor(gecenSure / 60000)}:${Math.floor((gecenSure % 60000) / 1000).toString().padStart(2, '0')}`;
            const toplamSureFormatted = `${Math.floor(toplamSure / 60000)}:${Math.floor((toplamSure % 60000) / 1000).toString().padStart(2, '0')}`;

            // Musicard ile Spotify karti olusturuyoruz
            let spotifyCard = await Classic({
                thumbnailImage: `https://i.scdn.co/image/${presence.assets.largeImage.slice(8)}`,
                backgroundColor: "#070707",
                progress: (gecenSure / toplamSure) * 100,
                progressColor: "#ffffff",
                progressBarColor: "#f10202",
                name: presence.details,
                nameColor: "#ffffff",
                author: presence.state,
                authorColor: "#696969",
                startTime: sureCevir(gecenSure),
                endTime: sureCevir(toplamSure),
                timeColor: "#ffffff"
            });

            // Attachment olusturuyoruz
            const attachment = new AttachmentBuilder(spotifyCard, { name: "spotify-bilgi.png" });

            // Buton ile sarkiya yönlendirme
            const spotifyButton = new ButtonBuilder()
                .setLabel("Sarkiya Git")
                .setStyle(ButtonStyle.Link)
                .setURL(`https://open.spotify.com/track/${presence.syncId}`); // Spotify sarki ID'sini kullanarak baglanti olusturuyoruz.

            const row = new ActionRowBuilder().addComponents(spotifyButton);

            // Kullaniciya yanit veriyoruz
            message.reply({ files: [attachment], components: [row] });
        } else {
            message.reply("Kullanici su anda Spotify dinlemiyor.");
        }
    }
};

// Süreyi formatlamak için fonksiyon
function sureCevir(veri) {
    return moment.utc(veri).format("m:ss");
}
