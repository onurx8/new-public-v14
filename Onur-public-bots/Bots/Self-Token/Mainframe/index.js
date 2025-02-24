require('dotenv').config();
const { Client, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); 

const client = new Client({
    intents: config.intents.map(intent => GatewayIntentBits[intent])
});

client.commands = new Map();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.Isim, command);
}


async function updateBotPresence() {
    try {
        const tokenBackupPath = path.join(__dirname, 'Controller', 'token.json');
        const tokenBackup = fs.existsSync(tokenBackupPath) ? JSON.parse(fs.readFileSync(tokenBackupPath, 'utf8')) : { tokens: [], channels: [], tokenCount: 0 };
        const tokenCount = tokenBackup.tokens.length;

        console.log(`Durum güncelleniyor: ${tokenCount} token aktif`);

        await client.user.setPresence({
            status: 'dnd', 
            activities: [{ name: `${tokenCount} kadar token aktif`, type: 'WATCHING' }] 
        });

        console.log(`Durum başarıyla güncellendi: ${tokenCount} token aktif`);
    } catch (error) {
        console.error('Durum güncellenirken hata oluştu:', error);
    }
}


client.once('ready', async () => {
    console.log(`Bot olarak giriş yapıldı: ${client.user.tag}`);
    await updateBotPresence(); 
});


client.kullaniciKullanmaSayisi = {};


const roleLimitsForSingleToken = {
    '1286720384950992947': 5,  
    '1288035778009628692': 10,  
    '1286717304280842300': 15, 
    '1287365348135534713': 20, 
    '1287365311959666738': 25,  
    '1287365392788095017': 30, 
    '1229208344598941778': 50, 
};

const roleLimitsForMultiToken = {
    '1287365348135534713': 5,  
    '1287365311959666738': 8,  
    '1287365392788095017': 10, 
    '1229208344598941778': 50, 
};


client.on('interactionCreate', async interaction => {
    const settingsPath = path.join(__dirname, '..','Controller', 'settings.json');
    const tokenBackupPath = path.join(__dirname, '..','Controller', 'token.json'); 
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const tokenBackup = fs.existsSync(tokenBackupPath) ? JSON.parse(fs.readFileSync(tokenBackupPath, 'utf8')) : { tokens: [], channels: [], tokenCount: 0 };

    if (interaction.type === InteractionType.MessageComponent) {
        const userId = interaction.user.id;
        const currentDate = new Date().toDateString();

      
        if (!client.kullaniciKullanmaSayisi[userId]) {
            client.kullaniciKullanmaSayisi[userId] = { 
                singleTokenCount: 0, 
                multiTokenCount: 0, 
                lastDate: currentDate 
            };
        }

      
        if (client.kullaniciKullanmaSayisi[userId].lastDate !== currentDate) {
            client.kullaniciKullanmaSayisi[userId].singleTokenCount = 0;
            client.kullaniciKullanmaSayisi[userId].multiTokenCount = 0;
            client.kullaniciKullanmaSayisi[userId].lastDate = currentDate;
        }

        const userRoles = interaction.member.roles.cache.map(role => role.id);
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

     
        if (interaction.customId === 'get_token') {
       
            if (singleTokenLimit === 0) {
                return interaction.reply({ content: 'Token Eklemek İçin Heran Gibi Bir Üyeliğiniz Bulunmuyor', ephemeral: false });
            }

    
            if (client.kullaniciKullanmaSayisi[userId].singleTokenCount >= singleTokenLimit) {
                return interaction.reply({ content: `Günlük token ekleme limitinizi aştınız Günlük Limitiniz => (${singleTokenLimit}) .`, ephemeral: true });
            }

     
            const modal = new ModalBuilder()
                .setCustomId('token_modal')
                .setTitle('Token Bilgileri');

            const tokenInput = new TextInputBuilder()
                .setCustomId('token_input')
                .setLabel('Tokeninizi girin')
                .setStyle(TextInputStyle.Short);

            const channelInput = new TextInputBuilder()
                .setCustomId('channel_input')
                .setLabel('Kanal ID\'si')
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(tokenInput);
            const secondActionRow = new ActionRowBuilder().addComponents(channelInput);

            modal.addComponents(firstActionRow, secondActionRow);
            await interaction.showModal(modal);

        
            client.kullaniciKullanmaSayisi[userId].singleTokenCount++;
        } 
   
        else if (interaction.customId === 'get_multi_token') {
          
            if (multiTokenLimit === 0) {
                return interaction.reply({ content: 'Birden Fazla Token Eklemek için Bir Üst Paketimize Geçiniz.', ephemeral: true });
            }

       
            if (client.kullaniciKullanmaSayisi[userId].multiTokenCount >= multiTokenLimit) {
                return interaction.reply({ content: `Günlük Birden Fazla token ekleme limitinizi  => (${multiTokenLimit}) aştınız.`, ephemeral: true });
            }

         
            const modal = new ModalBuilder()
                .setCustomId('multi_token_modal')
                .setTitle('Çoklu Token Bilgileri');

            const multiTokenInput = new TextInputBuilder()
                .setCustomId('multi_token_input')
                .setLabel('Tokenleri girin (yeni bir satıra yazın)')
                .setStyle(TextInputStyle.Paragraph);

            const multiChannelInput = new TextInputBuilder()
                .setCustomId('multi_channel_input')
                .setLabel('Kanal ID\'lerini girin (yeni bir satıra yazın)')
                .setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder().addComponents(multiTokenInput);
            const secondActionRow = new ActionRowBuilder().addComponents(multiChannelInput);

            modal.addComponents(firstActionRow, secondActionRow);
            await interaction.showModal(modal);

           
            client.kullaniciKullanmaSayisi[userId].multiTokenCount++;
        }

        if (interaction.customId === 'open_form') {
            const modal = new ModalBuilder()
                .setCustomId('kopyala_form')
                .setTitle('Sunucu Bilgilerini Girin')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('token')
                            .setLabel('Token')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('Tokeninizi girin')
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('input_guild_id')
                            .setLabel('Kopyalanacak Sunucu ID')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('Kopyalanacak Sunucu ID')
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('output_guild_id')
                            .setLabel('Aktarım Yapılacak Sunucu ID')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('Aktarım Yapılacak Sunucu ID')
                            .setRequired(true)
                    )
                );
            await interaction.showModal(modal);
        }
    } else if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === 'token_modal') {
            const token = interaction.fields.getTextInputValue('token_input');
            const channelId = interaction.fields.getTextInputValue('channel_input');

         
            settings.tokens.push(token);
            settings.channels.push(channelId);
            settings.tokenCount = (settings.tokenCount || 0) + 1;

            tokenBackup.tokens.push(token);
            tokenBackup.channels.push(channelId);
            tokenBackup.tokenCount = (tokenBackup.tokenCount || 0) + 1;

    
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            fs.writeFileSync(tokenBackupPath, JSON.stringify(tokenBackup, null, 2));

            await interaction.reply({ content: 'Token ve ses kanalı ID\'si başarıyla kaydedildi. Dikkat Tokeniniz yanlış veya hatalı ise otomatik olarak geri kaldırılacaktır.', ephemeral: true });

            await updateBotPresence();
        } else if (interaction.customId === 'multi_token_modal') {
            const tokens = interaction.fields.getTextInputValue('multi_token_input').split('\n');
            const channelIds = interaction.fields.getTextInputValue('multi_channel_input').split('\n');

      
            settings.tokens.push(...tokens);
            settings.channels.push(...channelIds);
            settings.tokenCount = (settings.tokenCount || 0) + tokens.length;

            tokenBackup.tokens.push(...tokens);
            tokenBackup.channels.push(...channelIds);
            tokenBackup.tokenCount = (tokenBackup.tokenCount || 0) + tokens.length;

      
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            fs.writeFileSync(tokenBackupPath, JSON.stringify(tokenBackup, null, 2));

            await interaction.reply({ content: 'Tokenler ve ses kanalı ID\'leri başarıyla kaydedildi.', ephemeral: true });

      
            await updateBotPresence();
        }
     
        else if (interaction.customId === 'kopyala_form') {
            const token = interaction.fields.getTextInputValue('token');
            const inputGuildId = interaction.fields.getTextInputValue('input_guild_id');
            const outputGuildId = interaction.fields.getTextInputValue('output_guild_id');
        
            const userId = interaction.user.id;
            const userRoles = interaction.member.roles.cache.map(role => role.id);
            let singleTokenLimit = 0;
        
        
            for (const roleId of Object.keys(roleLimitsForSingleToken)) {
                if (userRoles.includes(roleId)) {
                    singleTokenLimit = roleLimitsForSingleToken[roleId];
                    break;
                }
            }
        
         
            if (!client.kullaniciKullanmaSayisi[userId]) {
                client.kullaniciKullanmaSayisi[userId] = { singleTokenCount: 0, multiTokenCount: 0, lastDate: new Date().toDateString() };
            }
        
      
            if (client.kullaniciKullanmaSayisi[userId].singleTokenCount >= singleTokenLimit) {
                return interaction.reply({ content: `Günlük limitiniz (${singleTokenLimit}) kadar token ekleyebilirsiniz. Limitinizi aştınız.`, ephemeral: true });
            }
        
            const pythonFilePath = path.join(__dirname, '..','discord-main', 'main.py');
        
            let data = await fs.promises.readFile(pythonFilePath, 'utf8');
      
            let updatedData = data
                .replace(/token = ".*?"/, `token = "${token}"`)
                .replace(/input_guild_id = ".*?"/, `input_guild_id = "${inputGuildId}"`)
                .replace(/output_guild_id = ".*?"/, `output_guild_id = "${outputGuildId}"`);
        
            await fs.promises.writeFile(pythonFilePath, updatedData, 'utf8');
        
          
            client.kullaniciKullanmaSayisi[userId].singleTokenCount++;
        
         
            await interaction.reply({ content: 'Aktarım başladı, lütfen bekleyin...', ephemeral: true });
        
            exec(`python3 ${pythonFilePath}`, (error, stdout, stderr) => {
                if (error) {
               
                    if (error.message.includes('LoginFailure')) {
                        return interaction.editReply({ content: 'Token bilgileriniz yanlış, lütfen doğru bir şekilde tekrar girin.', ephemeral: true });
                    }
        
                    return interaction.editReply({ content: `Sistem çalıştırılırken bir hata oluştu:\n${error.message}`, ephemeral: true });
                }
        
                if (stdout.includes('Aktarım Tamamlandı...')) {
                    interaction.editReply({ content: 'Aktarım tamamlandı!  <a:Revuu:1287515902589272125>', ephemeral: true });
                } else {
                    interaction.editReply({ content: `İşlem başarıyla tamamlandı:\n${stdout}`, ephemeral: true });
                }
            });
        }
        
        
    }
});


client.on('messageCreate', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (command) {
        command.onRequest(client, message, args); 
    }
});


client.on('messageCreate', async message => {
    if (message.content.startsWith('!pm2')) { 
        const args = message.content.slice(5).trim().split(/ +/);
        const allowedIds = ["833656201623109712"]; 
        if (!allowedIds.includes(message.author.id)) return message.reply("Bu komutu kullanma izniniz yok.");

        const ls = exec(`pm2 ${args.join(' ')}`);
        ls.stdout.on('data', function (data) {
            const arr = Discord.Util.splitMessage(data, { maxLength: 1950, char: "\n" });
            arr.forEach(element => {
                message.channel.send(Discord.Formatters.codeBlock("js", element));
            });
        });

        ls.stderr.on('data', function (data) {
            message.channel.send(Discord.Formatters.codeBlock("js", `Hata: ${data}`));
        });

        ls.on('close', (code) => {
            message.channel.send(`PM2 işlemi kapandı. Çıkış kodu: ${code}`);
        });
    }
});

client.login(config.token);
