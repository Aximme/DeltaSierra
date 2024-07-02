const Discord = require("discord.js")
const {EmbedBuilder} = require("discord.js");

module.exports = {

    name: "closethread",
    description: "Permet de vérouiller un thread.",
    permission: Discord.PermissionFlagsBits.KickMembers,
    category:"<:shield2:1257466393616449586>  •  Modération :",
    dm: false,


    async run(bot, message, args) {

        if (!message.channel.isThread()) {
            return message.reply({ content: '<:goodwarning:1257678225509711973> | Cette commande doit être utilisée dans un fil.', ephemeral: true });
        }

        const thread = message.channel;

        if (!thread.locked) {
            await thread.setLocked(true);
            const embed = new EmbedBuilder()
                .setColor("#e73a3a")
                .setTitle('<:lock:1257466377711910972>  Thread fermé par l\'équipe de modération')
                .setDescription(`Une autre question ? Ré-ouvre un thread : <#1257806467319201965>`)
                .setTimestamp()
                .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

            await message.reply({ embeds: [embed] });
            //await thread.send({ embeds: [embed] });
            //await message.reply({ content: 'Le fil a été verrouillé avec succès.', ephemeral: true });
        } else {
            await message.reply({ content: '<:lock:1257466377711910972>  | Le fil est déjà verrouillé.', ephemeral: true });
        }
    }
};