import Discord from 'discord.js';
import dotenv from 'dotenv';
import { Command, SubcommandGroup, Subcommand } from './structures/command';
import { Folder } from './structures/folder';

/** Structure for managing interactions */
export default class InteractionsHandler {
  /** Structure for managing commands folder */
  commandsFolder: Folder;

  constructor() {
    dotenv.config();
    this.commandsFolder = new Folder(process.env.COMMANDS_FOLDER || "commands");
  }

  /**
   * Handle interactions depending on its type
   * @param client Discord client
   * @param interaction Discord interaction
   */
  async handleInteraction(client: Discord.Client, interaction: Discord.Interaction){

    // If command
    if (interaction.isCommand()) {

      // Determine command type
      const commandType: string = interaction.options?.data?.[0]?.type || "COMMAND";
      
      // Handle based on command type
      switch (commandType) {
        case "COMMAND":
        var command = <Command>this.commandsFolder.file(interaction.commandName);
        await command.execute?.();
        break;

        case "SUB_COMMAND":
        var command = <Command>this.commandsFolder.file(interaction.commandName);
        var subcommand = <Subcommand>command.options?.get(interaction.options.getSubcommand());
        await subcommand.execute?.();
        break;

        case "SUB_COMMAND_GROUP":
        var command = <Command>this.commandsFolder.file(interaction.commandName);
        var subcommandgroup = <SubcommandGroup>command.options?.get(interaction.options.getSubcommandGroup());
        var subcommand = <Subcommand>subcommandgroup.options?.get(interaction.options.getSubcommand());
        await subcommand.execute?.();
      }
    }
  }

  async syncCommands(client: Discord.Client) {
  }
}