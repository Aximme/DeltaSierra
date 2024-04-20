const Discord = require("discord.js")
const discordTranscripts = require('discord-html-transcripts');
const {EmbedBuilder} = require("discord.js");
const moment = require("moment");

module.exports = async (bot, interaction) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused()

        if(interaction.commandName === "help") {

            let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name:cmd.name, value: cmd.name})): choices.map(choice => ({name:choice.name, value:choice.name})))
        }

        if(interaction.commandName ==="setantiraid") {

            let choices = ["on","off"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }
    }


    if(interaction.type === Discord.InteractionType.ApplicationCommand) {

        let command = require(`../Commands/${interaction.commandName}`)
        command.run(bot, interaction, interaction.options, bot.db)
    }



    /*------------------------------ TICKET SYSTEM ------------------------------*/



    if (interaction.isStringSelectMenu()) {
        const value = interaction.values[0];
        if (interaction.customId === 'openticket') {
            const modal = new Discord.ModalBuilder()
                .setCustomId('myModal')
                .setTitle(`Ticket ${value}`);

            const favoriteColorInput = new Discord.TextInputBuilder()
                .setCustomId('prblm')
                .setLabel("Quel est le problème ?")
                .setStyle(Discord.TextInputStyle.Paragraph);

            const firstActionRow = new Discord.ActionRowBuilder().addComponents(favoriteColorInput);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
            const embed = new EmbedBuilder()
                .setTitle("\\🎫 Systeme de Tickets")
                .setDescription("Pour ouvrir un ticket, choisis une categorie correspondant a ton probleme ci-dessous.")
                .setColor("#5865F2")
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            const select = new Discord.StringSelectMenuBuilder()
                .setCustomId('openticket')
                .setPlaceholder('Faitre votre choix !')
                .addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('⚠️ Signalement / Plainte')
                        .setValue('Signalement_Plainte'),
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('⚙️ Rapport de Bug(s)')
                        .setValue('Rapport_Bug'),
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('🛡️ Demande de Debanissement')
                        .setValue('Debanissement'),
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel('🧭 Autre')
                        .setValue('Autre'),
                );

            const row = new Discord.ActionRowBuilder()
                .addComponents(select);
            await interaction.message.edit({embeds: [embed], components: [row]})

            try {
                const reponse = await interaction.awaitModalSubmit({ time: 300000 });

                const sujet = reponse.fields.getTextInputValue('prblm');

                const embedProbleme = new Discord.EmbedBuilder()
                    .setTitle(`\\🎫 Ticket de  \`${interaction.user.username}\``)
                    .setThumbnail(interaction.guild.iconURL({dynamic:true}))
                    .addFields({name:"\\📌 Sujet de la demande :", value:`${interaction.values[0]}`, inline:true},{name:"\\📋 Contexte / Message Initial :", value:`\`\`\`md\n${sujet}\`\`\``, inline:true})
                    .setTimestamp()
                    .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });


                const channel = await interaction.guild.channels.create({
                    name: `${interaction.values[0]}-${interaction.user.username}`,
                    type: 0,
                    parent: interaction.channel.parent.id,
                })

                await channel.permissionOverwrites.create(interaction.guild.id, {
                    ViewChannel: false,
                });

                await channel.setTopic(interaction.user.id)
                await reponse.reply({content: `Votre Ticket a bien été ouvert ! \n${channel}`, ephemeral: true})

                await channel.permissionOverwrites.create(interaction.user.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    AttachFiles: true,
                    EmbedLinks: true,
                });

                await channel.permissionOverwrites.create(interaction.client.user.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    AttachFiles: true,
                    EmbedLinks: true,
                });

                const button1 = new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Fermer le ticket")
                    .setEmoji('🗑️')
                    .setCustomId('close');

                const button = new Discord.ActionRowBuilder().addComponents(button1);

                const msg = await channel.send({content: `${interaction.user}`, embeds: [embedProbleme]})
                setTimeout(async () => {
                    await msg.edit({content: "", embeds: [embedProbleme], components: [button]})
                }, 2000);
            } catch (err) {
                await interaction.reply({ content: "Une erreur est survenue!", ephemeral: true });
                console.log(err);
            }
        }
    }
    if(interaction.isButton()) {
        if(interaction.customId === 'close') {
            await interaction.deferUpdate()

            const button1 = new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Success)
                .setLabel("✅")
                .setCustomId('yesclose');

            const button2 = new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("❌")
                .setCustomId('noclose');
            const button = new Discord.ActionRowBuilder().addComponents(button1, button2);

            await interaction.message.edit({components: [button]})
        }
        if(interaction.customId === 'yesclose') {
            const user = interaction.guild.members.cache.get(interaction.channel.topic);
            interaction.deferUpdate()
            const embed = new Discord.EmbedBuilder()
                .setDescription(`🗑️ Fermeture du ticket de ${user}...`)
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            await interaction.message.reply({embeds: [embed], components: []})
            const transticket = await discordTranscripts.createTranscript(interaction.channel)
            try {
                const transcriptsLogs = 'transcripts-logs';
                const channel = bot.channels.cache.find(ch => ch.name === transcriptsLogs);
                await channel.send({ content: `Le ticket \`${interaction.channel.name}\` a été fermé le <t:${Math.floor(parseInt(Date.now()) / 1000)}:F>.`, files: [transticket] });
            } catch (err) { console.log(err);}

            setTimeout(async() => {
                await interaction.channel.delete()
            }, 4000);
        }
        if(interaction.customId === 'noclose') {
            interaction.deferUpdate()
            const button1 = new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Fermer le ticket")
                .setEmoji('🗑️')
                .setCustomId('close');

            const button = new Discord.ActionRowBuilder().addComponents(button1);

            await interaction.message.edit({components: [button]})
        }
    }

    /*------------------------------ END TICKET SYSTEM ------------------------------*/


}