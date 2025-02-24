const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle 
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);


const runningProcesses = new Map();

module.exports = {
    Isim: "joiner",
    Komut: ["joiner"],
    Kullanim: "joiner",
    Aciklama: "Joiner komutunu çalıştırır ve form ekranını açar.",
    Kategori: "genel",
    Extend: true,

    onRequest: async function (client, message, args) {
        const userId = message.author.id;

   
        if (runningProcesses.has(userId)) {
            const closeButton = new ButtonBuilder()
                .setCustomId('closeRunningProcess')
                .setLabel('Sistemi Şu Anda Durdur')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(closeButton);

            await message.channel.send({
                content: '⚠️ Halen sizin için çalışan bir sistem var. Bu sistemi kapatmak ister misiniz?',
                components: [row]
            });

            const filter = (interaction) => interaction.customId === 'closeRunningProcess' && interaction.user.id === userId;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'closeRunningProcess') {
                    const processInfo = runningProcesses.get(userId);
                    if (processInfo && processInfo.process) {
                   
                        processInfo.process.kill();
                        clearInterval(processInfo.interval);
                        clearTimeout(processInfo.timeout);
                        runningProcesses.delete(userId);

                
                        try {
                            const { stdout: portPids } = await execPromise("lsof -t -i:3004");
                            const pids = portPids.split('\n').filter(pid => pid).map(Number);
                            if (pids.length > 0) {
                                for (const pid of pids) {
                                    try {
                                        await execPromise(`kill ${pid}`);
                                    } catch (killErr) {
                                        console.error(`PID ${pid} kapatılamadı: ${killErr.message}`);
                                    }
                                }
                                await interaction.reply({ content: '🚫 Sistemimiz başarılı bir şekilde durdurulmuştur ve açık portlar kapatıldı.', ephemeral: true });
                            } else {
                                await interaction.reply({ content: '🚫 Sistemimiz başarılı bir şekilde durdurulmuştur, fakat kapatılacak açık port bulunamadı.', ephemeral: true });
                            }
                        } catch (err) {
                            console.error(`Port kapatma hatası: ${err.message}`);
                            await interaction.reply({ content: `🚫 Sistemimiz durduruldu, fakat port kapatılırken hata oluştu: ${err.message}`, ephemeral: true });
                        }
                    } else {
                        await interaction.reply({ content: '❌ Çalışan bir sistem bulunamadı.', ephemeral: true });
                    }
                }
            });

            return;
        }

    
        const combinedImagePath = path.join(__dirname, '..', 'images', 'joiner.png');

     
        const embedMessage = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Bilgilendirme')
            .setDescription(
                '**<a:berq:1287506663703576636> Tokenlerinizi Sunucunuza Kolayca Ekleyin! <a:berq:1287506663703576636>**\n\n' +
                '<:dasd:1287739472741666909> Bu komut, sunucunuza tokenlerinizi eklemek için gerekli bilgileri sağlamanızı gerektirir. Süreci başlatmak için aşağıdaki adımları takip edin:\n\n' +
                '**<:MMM:1287515978783133707> Nasıl Çalışır? <:MMM:1287515978783133707>**\n' +
                '1. <:b_:1287516016187801684> **Formu Doldurun:** Sizden istenen bilgileri girebileceğiniz bir form açılacak. Bu formda **Sunucu ID** ve **Tokenler** bilgilerini eksiksiz olarak girin.\n' +
                '2. <:b_:1287516016187801684> **Bilgilerin Kaydedilmesi:** Formu gönderdikten sonra, bilgileriniz güvenli bir şekilde kaydedilecektir. 🔒 Bu bilgiler sadece katılım sürecinizi başlatmak için kullanılacaktır.\n' +
                '3. <:b_:1287516016187801684> **Otomatik İşlem Başlatma:** Bilgileriniz başarılı bir şekilde alındıktan sonra, sistem gerekli işlemleri otomatik olarak başlatır. Bu süreçte yapmanız gereken tek şey formu dikkatlice doldurmak ve sonucu beklemektir. \n\n' +
                '**<a:berq:1287506663703576636> Neler Gerekiyor? <a:berq:1287506663703576636>**\n' +
                '- **Sunucu ID:** Katılım gerçekleştirmek istediğiniz sunucunun kimlik numarasını girin.\n' +
                '- **Tokenler:** Hesaplarınızın sunucuya katılabilmesi için bir veya daha fazla token bilgisi girmeniz gerekmektedir. (Her bir tokeni ayrı satırlara yazabilirsiniz.)\n\n' +
                '<:dasd:1287739472741666909> **Önemli Bilgiler** <:dasd:1287739472741666909>\n' +
                '- <a:simsek:1288573989916115035> **Bilgilerinizi Doğru Girin:** Yanlış bilgi girilmesi, sürecin başarısız olmasına ve işlemin yeniden başlamasına neden olabilir.\n' +
                '- <a:simsek:1288573989916115035> **Güvenliğiniz Önceliğimizdir:** Girdiğiniz bilgiler güvenli bir şekilde işlenir ve gizli tutulur.\n\n' +
                '**<a:berq:1287506663703576636> Joiner Botumuzu Sunucunuza Ekleyin <a:berq:1287506663703576636>**\n' +
                '- <a:simsek:1288573989916115035> Sunucunuza katılmak için Joiner botumuzu eklemeniz gerekmektedir. Botun **özel bir yetkiye** ihtiyacı yoktur; yalnızca **Davet Oluştur** yetkisi yeterlidir. Aşağıdaki linke tıklayarak kolayca ekleyebilirsiniz:\n\n' +
                '- **[Joiner Botunu Ekle](https://discord.com/oauth2/authorize?client_id=1290281522041192458&permissions=1&integration_type=0&scope=bot)**\n\n'
            )
            .setImage(`attachment://joiner.png`) 
            .setFooter({ text: 'Copyright © Developed by Bewrq 2024' });

    
        const joinButton = new ButtonBuilder()
            .setCustomId('openForm')
            .setLabel('Tokenlerini Sokk .xd')
            .setEmoji("1290284783515074596")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(joinButton);

   
        const initialMessage = await message.channel.send({
            embeds: [embedMessage],
            components: [row],
            files: [{
                attachment: combinedImagePath,
                name: 'joiner.png'
            }]
        });

      
        const filter = (interaction) => interaction.customId === 'openForm' && interaction.user.id === userId;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'openForm') {
          
                const modal = new ModalBuilder()
                    .setCustomId('joinerForm')
                    .setTitle('Joiner Formu');

             
                const guildIdInput = new TextInputBuilder()
                    .setCustomId('guildIdInput')
                    .setLabel('Sunucu ID Girin')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

            
                const tokensInput = new TextInputBuilder()
                    .setCustomId('tokensInput')
                    .setLabel('Tokenlerinizi Girin (Birden fazla satır)')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

             
                const firstActionRow = new ActionRowBuilder().addComponents(guildIdInput);
                const secondActionRow = new ActionRowBuilder().addComponents(tokensInput);

                modal.addComponents(firstActionRow, secondActionRow);

            
                await interaction.showModal(modal);
            }
        });

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId === 'joinerForm') {
                if (interaction.user.id !== userId) return; 

                const guildId = interaction.fields.getTextInputValue('guildIdInput');
                const tokens = interaction.fields.getTextInputValue('tokensInput');

          
                const configPath = path.join(__dirname, '..', 'Joins', 'config.js');
                const tokensPath = path.join(__dirname, '..', 'Joins', 'tokens.txt');
                const tokenLogPath = path.join(__dirname, '..', 'Joins', 'tokenlog.txt');
                const indexPath = path.join(__dirname, '..', 'Joins', 'src', 'index.js');

                try {
                  
                    let configContent = fs.readFileSync(configPath, 'utf8');
                    configContent = configContent.replace(/guildId: ".*?"/, `guildId: "${guildId}"`);
                    fs.writeFileSync(configPath, configContent, 'utf8');

                 
                    const tokensArray = tokens.split('\n').map(token => token.trim()).filter(token => token);
                    fs.writeFileSync(tokensPath, tokensArray.join('\n') + '\n', 'utf8');

                 
                    fs.appendFileSync(tokenLogPath, tokensArray.join('\n') + '\n', 'utf8');

               
                    await interaction.reply({ content: 'Bilgiler başarıyla kaydedildi ve gerekli işlemler başlatıldı.', ephemeral: true });

              
                    const childProcess = exec(`node "${indexPath}"`, (error, stdout, stderr) => {
                        let responseContent = '';
                        if (error) {
                            console.error(`Hata: ${error.message}`);
                            responseContent += `❗ Hata oluştu: ${error.message}\n`;
                        }
                        if (stderr) {
                            console.error(`Stderr: ${stderr}`);
                            responseContent += `⚠️ Uyarı: ${stderr}\n`;
                        }
                        if (stdout) {
                            console.log(`Stdout: ${stdout}`);
                            responseContent += `✅ İşlem başarıyla tamamlandı:\n\`\`\`${stdout}\`\`\``;
                        }

                      
                        interaction.followUp({ content: responseContent, ephemeral: true });
                    });

                   
                    let timeLeft = 300;

               
                    const interval = setInterval(async () => {
                        timeLeft -= 1;
                        const minutes = Math.floor(timeLeft / 60);
                        const seconds = timeLeft % 60;
                        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                        if (timeLeft >= 0) {
                          
                            await interaction.editReply({ 
                                content: `⏳ Kalan süre: ${formattedTime}\n\n   Sistemi durdurmak için aşağıdaki butona tıklayabilirsiniz.`,
                                ephemeral: true 
                            });
                        } 
                    }, 1000);

             
                    const timeout = setTimeout(async () => {
                        if (runningProcesses.has(userId)) {
                            const processInfo = runningProcesses.get(userId);
                            if (processInfo && processInfo.process) {
                                processInfo.process.kill();
                                runningProcesses.delete(userId);
                                clearInterval(processInfo.interval); 

                            
                                try {
                                    const { stdout: portPids } = await execPromise("lsof -t -i:3004");
                                    const pids = portPids.split('\n').filter(pid => pid).map(Number);
                                    if (pids.length > 0) {
                                        for (const pid of pids) {
                                            try {
                                                await execPromise(`kill ${pid}`);
                                            } catch (killErr) {
                                                console.error(`PID ${pid} kapatılamadı: ${killErr.message}`);
                                            }
                                        }
                                        await interaction.editReply({ content: '🚫 5 dakika dolduğu için sistemimiz başarılı bir şekilde durdurulmuştur ve açık portlar kapatıldı.', ephemeral: true });
                                    } else {
                                        await interaction.editReply({ content: '🚫 5 dakika dolduğu için sistemimiz başarılı bir şekilde durdurulmuştur, fakat kapatılacak açık port bulunamadı.', ephemeral: true });
                                    }
                                } catch (err) {
                                    console.error(`Port kapatma hatası: ${err.message}`);
                                    await interaction.editReply({ content: `🚫 Sistemimiz durduruldu, fakat port kapatılırken hata oluştu: ${err.message}`, ephemeral: true });
                                }
                            }
                        }
                    }, 5 * 60 * 1000); 

                  
                    const stopButton = new ButtonBuilder()
                        .setCustomId('stopProcess')
                        .setLabel('Sistemi Şu Anda Durdur')
                        .setStyle(ButtonStyle.Danger);

                    const stopRow = new ActionRowBuilder().addComponents(stopButton);

                    await interaction.followUp({
                        content: '🛑 Sistemi durdurmak için aşağıdaki butona tıklayabilirsiniz.',
                        components: [stopRow],
                        ephemeral: true
                    });

                
                    runningProcesses.set(userId, {
                        process: childProcess,
                        interval: interval,
                        timeout: timeout
                    });

               
                    const stopFilter = (btnInteraction) => btnInteraction.customId === 'stopProcess' && btnInteraction.user.id === userId;
                    const stopCollector = interaction.channel.createMessageComponentCollector({ filter: stopFilter, time: 5 * 60 * 1000 });

                    stopCollector.on('collect', async (btnInteraction) => {
                        const processInfo = runningProcesses.get(userId);
                        if (processInfo && processInfo.process) {
                         
                            processInfo.process.kill();
                            clearInterval(processInfo.interval);
                            clearTimeout(processInfo.timeout);
                            runningProcesses.delete(userId);

                      
                            try {
                                const { stdout: portPids } = await execPromise("lsof -t -i:3004");
                                const pids = portPids.split('\n').filter(pid => pid).map(Number);
                                if (pids.length > 0) {
                                    for (const pid of pids) {
                                        try {
                                            await execPromise(`kill ${pid}`);
                                        } catch (killErr) {
                                            console.error(`PID ${pid} kapatılamadı: ${killErr.message}`);
                                        }
                                    }
                                    await btnInteraction.reply({ content: '🚫 Sistemimiz başarılı bir şekilde durdurulmuştur ve açık portlar kapatıldı.', ephemeral: true });
                                } else {
                                    await btnInteraction.reply({ content: '🚫 Sistemimiz başarılı bir şekilde durdurulmuştur, fakat kapatılacak açık port bulunamadı.', ephemeral: true });
                                }
                            } catch (err) {
                                console.error(`Port kapatma hatası: ${err.message}`);
                                await btnInteraction.reply({ content: `🚫 Sistemimiz durduruldu, fakat port kapatılırken hata oluştu: ${err.message}`, ephemeral: true });
                            }
                        } else {
                            await btnInteraction.reply({ content: '❌ Çalışan bir sistem bulunamadı.', ephemeral: true });
                        }
                    });

                } catch (err) {
                    console.error(`Dosya İşleme Hatası: ${err.message}`);
                    await interaction.reply({ content: `❌ Bir hata oluştu: ${err.message}`, ephemeral: true });
                }
            }
        });
    },
};
