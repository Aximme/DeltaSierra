const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "delwarn",
    description: "Supprime un avertissement en utilisant son WarnID.",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "\\🛡️ • Modération :",
    options: [
        {
            type: "string",
            name: "warnid",
            description: "L'ID de l'avertissement que vous souhaitez supprimer.",
            required: true,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {
        try {
            const warnID = args.getString("warnid");

            if (!warnID) return message.reply("Veuillez spécifier l'ID de l'avertissement à supprimer.");

            db.query(
                `SELECT * FROM warns WHERE guildID = '${message.guildId}' AND warnID = '${warnID}'`,
                async (err, req) => {
                    const notFoundEmbed = new EmbedBuilder()
                        .setColor(0xFFC600)
                        .setTitle(`\\⚠️ Une erreur est survenue.`)
                        .addFields({
                            name: '‎',
                            value: `\`\`\`diff\n- Erreur survenue : \n\nAucun avertissement trouvé avec l'ID spécifié.\n\nRecherche effectuée sur : ${message.guild.name} (ID:${message.guild.id})\`\`\``,
                        })
                        .setTimestamp()
                        .setFooter({
                            text: 'DeltaSierra © 2024',
                            iconURL: bot.user.displayAvatarURL(),
                        });

                    if (req.length < 1) return message.reply({ embeds: [notFoundEmbed] });

                    const deletedWarn = req[0];

                    db.query(
                        `DELETE FROM warns WHERE guildID = '${message.guildId}' AND warnID = '${warnID}'`,
                        async (err) => {
                            if (err) throw err;

                            const successEmbed = new EmbedBuilder()
                                .setColor("#1a7325")
                                .setTitle(`\\🗑️ Avertissement supprimé.`)
                                .addFields({
                                    name: '‎',
                                    value: `\`\`\`md\n# Moderator #\n${message.user.tag}\n\n# WarnID #\n${deletedWarn.warnID}\`\`\``, inline : true},
                                    {name:'‎', value:`\`\`\`md\n# Raison initiale du Warn #\n${deletedWarn.reason}\`\`\``,inline:true})
                                .setTimestamp()
                                .setFooter({
                                    text: 'DeltaSierra © 2024',
                                    iconURL: bot.user.displayAvatarURL(),
                                });

                            await message.reply({ embeds: [successEmbed] });
                        }
                    );
                }
            );
        } catch (err) {
            console.log(err);
        }
    },
};
