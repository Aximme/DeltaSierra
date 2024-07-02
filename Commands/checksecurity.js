const Discord = require("discord.js");

module.exports = {
    name: "checksecurity",
    description: "Affiche les potentielles failles de sécurité d'un serveur.",
    permission: Discord.PermissionFlagsBits.Administrator,
    category: "<:admin:1257466365116289184>  • Administration :",
    dm: false,

    async run(bot, message, args) {
        const guild = message.guild;
        let channelVulnerabilities = [];
        let permissionVulnerabilities = {};

        // Vérifier les salons où everyone peut mentionner @everyone
        guild.channels.cache.forEach(channel => {
            if (channel.type === Discord.ChannelType.GuildText) {
                const role = guild.roles.everyone;
                const permissions = channel.permissionsFor(role);
                if (permissions.has(Discord.PermissionFlagsBits.MentionEveryone)) {
                    channelVulnerabilities.push(`<#${channel.id}> permet à tout le monde de mentionner \`@everyone\``);
                }
            }
        });

        // Vérifier les utilisateurs avec des permissions sensibles
        guild.members.cache.forEach(member => {
            if (!member.user.bot) {
                const sensitivePermissions = [
                    { bit: Discord.PermissionFlagsBits.Administrator, name: "Administrateur" }, // 8
                    { bit: Discord.PermissionFlagsBits.ManageChannels, name: "Gérer les salons" }, // 16
                    { bit: Discord.PermissionFlagsBits.ManageRoles, name: "Gérer les rôles" }, // 268435456
                    { bit: Discord.PermissionFlagsBits.BanMembers, name: "Bannir des membres" }, // 4
                    { bit: Discord.PermissionFlagsBits.KickMembers, name: "Expulser des membres" } // 2
                ];

                let permissionsList = [];
                sensitivePermissions.forEach(permission => {
                    if (member.permissions.has(permission.bit)) {
                        permissionsList.push(permission.name);
                    }
                });

                if (permissionsList.length > 0) {
                    permissionVulnerabilities[member.user.id] = permissionsList;
                }
            }
        });

        let vulnerabilitiesEmbed = new Discord.EmbedBuilder()
            .setColor("#F58F2A")
            .setTitle("<:goodwarning:1257678225509711973>  Vulnérabilités du Serveur  <:goodwarning:1257678225509711973>")
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setTimestamp()
            .setFooter({ text: 'DeltaSierra © 2024', iconURL: bot.user.displayAvatarURL() });

        if (channelVulnerabilities.length > 0) {
            vulnerabilitiesEmbed.addFields([{ name: "<:redglobe:1257704719766523925>  Salons - Vulnérabilité(s) trouvé(es)", value: channelVulnerabilities.join('\n') }]);
        } else {
            vulnerabilitiesEmbed.addFields([{ name: "<:greencheck:1257704390677102616>  Salons - 0 Vulnérabilité trouvée", value: "Heureusement, rien à signaler ici !" }]);
        }

        if (Object.keys(permissionVulnerabilities).length > 0) {
            let permissionFields = Object.entries(permissionVulnerabilities).map(([userId, permissions]) => {
                return `<@${userId}> a des permissions sensibles: ${permissions.join(', ')}`;
            });
            vulnerabilitiesEmbed.addFields([{ name: "<:perms:1257703894746927165>  Permissions - Vulnérabilité(s) trouvé(es)", value: permissionFields.join('\n') }]);
        } else {
            vulnerabilitiesEmbed.addFields([{ name: "<:greencheck:1257704390677102616>  Permissions - 0 Vulnérabilité trouvée", value: "Heureusement, rien à signaler ici !" }]);
        }

        await message.reply({ embeds: [vulnerabilitiesEmbed] });
    }
};
