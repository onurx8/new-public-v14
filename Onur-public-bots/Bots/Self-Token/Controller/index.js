const { BEWRK, CustomStatus, RichPresence, SpotifyRPC } = require('./Classes/Client');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


let ignoreWatch = false;



function clearCache(modulePath) {
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
}


let Settings = clearCache('./settings.json');
const Spotify = clearCache('./Spotify/Data.json');

let clients = []; 
let obj = {
    selfMute: false,
    selfDeaf: false,
};



const USER_DATABASES_DIR = './Databases';

if (!fs.existsSync(USER_DATABASES_DIR)) {
    fs.mkdirSync(USER_DATABASES_DIR);
}



fs.watch('./settings.json', (eventType, filename) => {
    if (ignoreWatch) {
        ignoreWatch = false;
        return;
    }
    if (filename) {
        console.log(`${filename} dosyasında bir değişiklik tespit edildi.`);
        Settings = clearCache('./settings.json'); 
        processNewTokens(Settings);
    }
});


loadSettings();

function loadSettings() {
    Settings.tokens.forEach((token, index) => {
        let channel = Settings.channels[index] || Settings.channels[0];
        addClientToDatabase(token, channel);
    });

    loadClientsFromDatabase();
  
    loadClientsFromUserFiles();
  
}

function processNewTokens(newSettings) {
    newSettings.tokens.forEach((token, index) => {
   
        let providedChannel = (newSettings.channels && newSettings.channels.length > index) ? newSettings.channels[index] : null;
        
     
        if (clients.some(client => client.token === token)) {
            let oldClient = clients.find(client => client.token === token);
       
            if (typeof oldClient.leaveChannel === "function") {
                oldClient.leaveChannel();
            }
    
            if (typeof oldClient.destroy === "function") {
                oldClient.destroy();
            }
   
            const filePath = `./Databases/${oldClient.user?.tag || token}.json`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
    
            clients = clients.filter(client => client.token !== token);
       
            if (providedChannel) {
                const client = new BEWRK();
                client.login(token).then(() => {
                    console.log(`Token ve kanal eşzamanlı eklenmiş; eski bağlantı kesilip yeniden ekleniyor: ${token}`);
                    createClient(token, providedChannel, index);
                }).catch(() => {
                    console.log(`Hatalı token bulundu ve settings.json'dan kaldırılıyor: ${token}`);
                });
            } else {
                console.log(`Sadece token eklenmiş; mevcut client tamamen kapatıldı: ${token}`);
            }
        } else {
  
            if (providedChannel) {
                const client = new BEWRK();
                client.login(token).then(() => {
                    console.log(`Yeni token doğrulandı ve ekleniyor: ${token}`);
                    addClientToDatabase(token, providedChannel); 
                    createClient(token, providedChannel, index);
                }).catch(() => {
                    console.log(`Hatalı token bulundu ve settings.json'dan kaldırılıyor: ${token}`);
                });
            } else {
     
                console.log(`Token eklendi ancak kanal bilgisi yok, işlem yapılmayacak: ${token}`);
            }
        }
    });

    resetSettings();
}


function addClientToDatabase(token, channel) {
    return;
}


function removeTokenFromSettings(token, index) {
    resetSettings();
}


function loadClientsFromDatabase() {
    return;
}


function loadClientsFromUserFiles() {
    fs.readdirSync(USER_DATABASES_DIR).forEach(file => {
        if (file.endsWith('.json') && file !== 'tokens.json') {
            const filePath = `${USER_DATABASES_DIR}/${file}`;
            try {
                const adapter = new FileSync(filePath);
                const db = low(adapter);
                const token = db.get('token').value();
                const channel = db.get('channel').value();
                if (token && !clients.some(client => client.token === token)) {
                    console.log(`User dosyasından token yüklendi: ${file}`);
                    createClient(token, channel, file);
                }
            } catch (err) {
                console.error(`Dosya okunurken hata oluştu: ${file}`, err);
            }
        }
    });
}



function resetSettings() {
    const newSettings = {
        tokens: [],
        channels: [],
        tokenCount: 20
    };
    ignoreWatch = true;
    fs.writeFileSync('./settings.json', JSON.stringify(newSettings, null, 2));
}

function createClient(token, channel, index) {
    const client = new BEWRK();
    client.token = token; 
    clients.push(client); 

    client.login(token).catch(async (err) => {
        console.log(`${index + 1}. Satırdaki token arızalı olduğundan kaldırıldı.`);

   

        const faultyDatabasePath = `./Databases/${client.user?.tag || token}.json`;
        if (fs.existsSync(faultyDatabasePath)) {
            fs.unlinkSync(faultyDatabasePath);
        }
    });

    client.on('ready', async () => {
        const dirDatabase = new FileSync(`./Databases/${client.user.tag}.json`);
        const Database = low(dirDatabase);
        Database.defaults({ channel: null }).write();


        await Database.set("token", client.token).write();
 

        let get_channel = await Database.get("channel").value();
        let find = client.channels.cache.get(get_channel) || client.channels.cache.get(channel);
        if (!find) return console.log(`[${client.user.tag}] Kanal bulunamadığından giriş yapamadı.`);
        
        client.joinChannel(find, obj);
        if (!get_channel) await Database.set("channel", find.id).write();
        if (get_channel && get_channel != find.id) await Database.set("channel", find.id).write();

        client.user.setStatus("dnd");
        RPC(client);
    });

    client.on("presenceUpdate", (oldPresence, newPresence) => {
        try {
            if (!oldPresence || !newPresence) return;

            let oldMember, newMember;
            try {
                oldMember = oldPresence.member;
            } catch(e) {
                return;
            }
            try {
                newMember = newPresence.member;
            } catch(e) {
                return;
            }
            if (!oldMember || !newMember) return;
            if (oldMember.id != client.user.id || newMember.id != client.user.id) return;
            client.user.setStatus("dnd");
            RPC(client);
            console.log(`[${client.user.tag}] Rahatsız etmeyin dışında olduğu için otomatik olarak rahatsız etmeyin yapıldı.`);
        } catch (err) {
            console.error("presenceUpdate sırasında hata:", err);
        }
    });

    client.on("voiceStateUpdate", async (oldState, newState) => {
        if (oldState.channel && !newState.channel && client.user.id == oldState.id) {
            console.log(`[${client.user.tag}] Kanaldan Düştü Tekrardan Giriş Yapılacak.`);
            setTimeout(async () => {
                const dirDatabase = new FileSync(`./Databases/${client.user.tag}.json`);
                const Database = low(dirDatabase);
                let get_channel = await Database.get("channel").value();
                let find = client.channels.cache.get(get_channel) || client.channels.cache.get(channel);
                if (!find) return console.log(`[${client.user.tag}] Kanal bulunamadığından giriş yapamadı.`);
                client.joinChannel(find, obj);
            }, 2300);
        }
        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            if (oldState.member.id == client.user.id) {
                console.log(`[${client.user.tag}] Kanalı ${oldState.channel.name} kanalından ${newState.channel.name} kanalı olarak değiştirildi.`);
                const dirDatabase = new FileSync(`./Databases/${client.user.tag}.json`);
                const Database = low(dirDatabase);
                await Database.set("channel", newState.channelId).write();
            }
        }
    });
}

function RPC(client, game) {
    if (game) {
        return;
    }
    let SpotifyObj = Spotify.items.map(x => {
        let artist = x.track.album.artists.map(x => x.name).join(", ");
        let artistid = x.track.album.artists.map(x => x.id);
        let album = x.track.album.name;
        let albumid = String(x.track.album.uri.replace("spotify:album:", ""));
        let id = x.track.id;
        let track = x.track.name;
        let image = String(x.track.album.images[0].url.replace("https://i.scdn.co/image/", ""));
        let duration = x.track.duration_ms;
        return {
            id,
            artist,
            artistid,
            album,
            albumid,
            track,
            image,
            duration,
        };
    });

    let Track = SpotifyObj[Math.floor(Math.random() * SpotifyObj.length)];
    setTimeout(() => {
        RPC(client);
    }, Track.duration);

    client.user.setActivity(new SpotifyRPC(client)
        .setAssetsLargeImage(`spotify:${Track.image}`)
        .setAssetsLargeText(Track.album)
        .setState(`${Track.artist}`)
        .setDetails(Track.track)
        .setStartTimestamp(Date.now())
        .setEndTimestamp(Date.now() + Track.duration)
        .setSongId(Track.id)
        .setAlbumId(Track.albumid)
        .setArtistIds(Track.artistid));
}
