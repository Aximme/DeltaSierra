const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {

    name: "help",
    description: "Affiche une liste de toutes les commandes disponibles.",
    permission: "Aucune",
    dm: true,
    category:"\\📋 • Informations :",
    options: [
        {
            type:"string",
            name:"commande",
            description:"La commande que vous souhaitez afficher",
            required:false,
            autocomplete: true,
        }
    ],

    async run(bot, message, args) {

        let command;
        if(args.getString("commande")) {
            command = bot.commands.get(args.getString("commande"));

            const occuredError = new EmbedBuilder()
                .setColor(0xFFC600)
                .setTitle(`\\⚠️ Une erreur est survenue.`)
                .addFields({ name: '‎', value: `\`\`\`diff\n- Détails de l'erreur :\n\nLa commande saisie n'a pas été trouvée. Veuillez réessayer.\`\`\`` })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            if(!command) return message.reply({embeds:[occuredError]})
        }

        if(!command) {
            let categories = [];
            bot.commands.forEach(command => {
                if(!categories.includes(command.category)) categories.push(command.category)
            })

            let helpEmbed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`\\⚔️ Menu des Commandes de DeltaSierra \\⚔️`)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Des question, suggestions ou rapport de bugs. Merci d'ouvrir une request ici : [GitHub du Bot.](https://github.com/Aximme/DeltaSierra)`)
                .addFields({name:`‎`, value:`Le bot regroupes un nombre de \`${bot.commands.size}\` commandes. Réparties en \`${categories.length}\` catégories.`},
                { name: '\u200B', value: '\u200B' })
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            await categories.sort().forEach(async cat => {

                let commands = bot.commands.filter(cmd => cmd.category === cat)
                helpEmbed.addFields({name:`${cat}`, value: `\`\`\`json\n${commands.map(cmd =>`\"${cmd.name}\" : ${cmd.description}`).join("\n")}\`\`\``})
            })

            await message.reply({embeds: [helpEmbed]})
        } else {
            catego = command.category
            cut_catego = catego.slice(1, -1);

            let focusHelp = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`\\📌 Détails de la Commande - \`${command.name}\``)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .addFields({ name: '‎', value: `\`\`\`md\n# Description : #\n${command.description}\n\n# Permissions requises : #\n${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`\`\``,inline:true},
                                 { name: '‎', value: `\`\`\`md\n# Commande en DM : #\n${command.dm ? "Activées" : "Désactivées"}\n\n# Catégorie : #\n${cut_catego}\`\`\``,inline:true})
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });
            await message.reply({embeds:[focusHelp]})
        }
    }
}
