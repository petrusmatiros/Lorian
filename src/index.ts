import * as Discord from "discord.js";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();
const prefix = process.env.PREFIX || "!";

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  handleCommand(message);
});

client.login(process.env.DISCORD_BOT_TOKEN);

let authorList = [];
let sheetList = JSON.parse(fs.readFileSync("./sheets.json", "utf-8"));


function sendHelpMessage(message: Discord.Message) {
  const helpEmbed = new Discord.MessageEmbed()
    .setTitle("Available Commands")
    .addField("/help", "Lists commands")
    .addField("/author add <discord id or role>", "Adds author")
    .addField("/author remove <discord id or role>", "Removes author")
    .addField("/author list <discord id or role>", "Lists authors")
    .addField("/sheet add <sheet name> <sheet id>", "Adds a new sheet")
    .addField(
      "/sheet modify <name> or <sheet id>",
      "Modifies an existing sheet"
    )
    .addField("/sheet remove <name> or <sheet id>", "Removes an existing sheet")
    .addField("/sheet list", "Lists all available sheets")
    .addField(
      "/sheet <name> or <sheet id> add event <event id> trigger:<trigger> message:<message> in:<channel>",
      "Adds a new event to the sheet"
    )
    .addField(
      "/sheet <name> or <sheet id> modify event <event id> trigger:<new trigger> message:<new message> in:<new channel>",
      "Modifies an existing event in the sheet"
    )
    .addField(
      "/sheet <name> or <sheet id> remove event <event id>",
      "Removes an event from the sheet"
    )
    .addField(
      "/sheet <name> or <sheet id> event list",
      "Lists all events in the sheet"
    )
    .setTimestamp();
  message.channel.send(helpEmbed);
}

function manageAuthors(message: Discord.Message, args: string[]) {
  const subCommand = args[1];
  const author = args[2];
 

  switch (subCommand) {
    case "add":
      // check if the user already exists in the list of authorized users
      if (authorList.includes(author)) {
        message.channel.send(`User ${author} is already authorized`);
        return;
      }
      // add the user to the list of authorized users
      authorList.push(author);
      fs.writeFileSync("./authorizedUsers.txt", authorList.join("\n"));
      message.channel.send(`User ${author} has been authorized`);
      break;
    case "remove":
      // check if the user exists in the list of authorized users
      if (!authorList.includes(author)) {
        message.channel.send(`User ${author} is not authorized`);
        return;
      }
      // remove the user from the list of authorized users
      authorList = authorList.filter((item) => item !== author);
      fs.writeFileSync("./authorizedUsers.txt", authorList.join("\n"));
      message.channel.send(
        `User ${author} has been removed from authorized users`
      );
      break;
    case "list":
      // get the list of authorized users
      authorList = fs
        .readFileSync("./authorizedUsers.txt", "utf-8")
        .split("\n");
      // send the list of authorized users as a message
      message.channel.send(`Authorized users:\n${authorList.join("\n")}`);
      break;
    default:
      message.channel.send(
        `Invalid subcommand. Use ${prefix}help to see available commands.`
      );
  }
}

function manageSheets(message: Discord.Message, args: string[]) {
  const subCommand = args[1];
  const sheetName = args[2];
  const sheetId = args[3];


  switch (subCommand) {
    case "add":
      // check if the sheet already exists in the list of available sheets
      if (sheetList.some((item) => item.sheetId === sheetId)) {
        message.channel.send(`Sheet with ID ${sheetId} already exists`);
        return;
      }
      // add the sheet to the list of available sheets
      sheetList.push({ sheetName, sheetId });
      fs.writeFileSync("./sheets.json", JSON.stringify(sheetList));
      message.channel.send(
        `Sheet with ID ${sheetId} has been added to the list`
      );
      break;
    case "remove":
      // check if the sheet exists in the list of available sheets
      const index = sheetList.findIndex((item) => item.sheetId === sheetId);
      if (index === -1) {
        message.channel.send(`Sheet with ID ${sheetId} does not exist`);
        return;
      }
      // remove the sheet from the list of available sheets
      sheetList.splice(index, 1);
      fs.writeFileSync("./sheets.json", JSON.stringify(sheetList));
      message.channel.send(
        `Sheet with ID ${sheetId} has been removed from the list`
      );
      break;
    case "modify":
      // check if the sheet exists in the list of available sheets
      const sheetIndex = sheetList.findIndex(
        (item) => item.sheetId === sheetId
      );
      if (sheetIndex === -1) {
        message.channel.send(`Sheet with ID ${sheetId} does not exist`);
        return;
      }
      // modify the sheet name or sheet id
      if (args[4] && args[4].toLowerCase() === "name") {
        sheetList[sheetIndex].sheetName = args[5];
      } else if (args[4] && args[4].toLowerCase() === "id") {
        // check if the new sheet id already exists in the list of available sheets
        if (sheetList.some((item) => item.sheetId === args[5])) {
          message.channel.send(`Sheet with ID ${args[5]} already exists`);
          return;
        }
        sheetList[sheetIndex].sheetId = args[5];
      } else {
        message.channel.send(
          `Invalid subcommand. Use ${prefix}help to see available commands.`
        );
        return;
      }
      fs.writeFileSync("./sheets.json", JSON.stringify(sheetList));
      message.channel.send(`Sheet with ID ${sheetId} has been modified`);
      break;
    case "list":
      // get the list of available sheets
      sheetList = JSON.parse(fs.readFileSync("./sheets.json", "utf-8"));
      // send the list of available sheets as a message
      message.channel.send(
        `Available sheets:\n${sheetList
          .map((item) => `${item.sheetName} - ${item.sheetId}`)
          .join("\n")}`
      );
      break;
    default:
      message.channel.send(
        `Invalid subcommand. Use ${prefix}help to see available commands.`
      );
  }
}

function manageEvents(message: Discord.Message, args: string[]) {
  const subCommand = args[1];
  const sheetId = args[2];
  const eventId = parseInt(args[4], 10);
  const sheetList = JSON.parse(fs.readFileSync("./sheets.json", "utf-8"));
  const sheet = sheetList.find((item) => item.sheetId === sheetId);
  if (!sheet) {
    message.channel.send(`Sheet with ID ${sheetId} does not exist`);
    return;
  }
  const sheetName = sheet.sheetName;
  let events = JSON.parse(fs.readFileSync(`./events-${sheetId}.json`, "utf-8"));
  let eventIndex = events.findIndex((item) => item.id === eventId);

  switch (subCommand) {
    case "add":
      // create a new event
      const newEvent = {
        id: events.length > 0 ? events[events.length - 1].id + 1 : 1,
        trigger: args[6],
        message: args[8],
        channel: args[10].startsWith("<#") ? args[10].slice(2, -1) : args[10],
      };
      // add the event to the list of events for the specified sheet
      events.push(newEvent);
      fs.writeFileSync(`./events-${sheetId}.json`, JSON.stringify(events));
      message.channel.send(
        `Event ${newEvent.id} has been added to sheet ${sheetName}`
      );
      break;
    case "remove":
      if (eventIndex === -1) {
        message.channel.send(
          `Event with ID ${eventId} does not exist in sheet ${sheetName}`
        );
        return;
      }
      // remove the event from the list of events for the specified sheet
      events.splice(eventIndex, 1);
      fs.writeFileSync(`./events-${sheetId}.json`, JSON.stringify(events));
      message.channel.send(
        `Event with ID ${eventId} has been removed from sheet ${sheetName}`
      );
      break;
    case "modify":
      if (eventIndex === -1) {
        message.channel.send(
          `Event with ID ${eventId} does not exist in sheet ${sheetName}`
        );
        return;
      }
      // modify the trigger, message or channel for the specified event
      const newTrigger = args[6];
      const newMessage = args[8];
      const newChannel = args[10].startsWith("<#")
        ? args[10].slice(2, -1)
        : args[10];
      if (newTrigger) events[eventIndex].trigger = newTrigger;
      if (newMessage) events[eventIndex].message = newMessage;
      if (newChannel) events[eventIndex].channel = newChannel;
      fs.writeFileSync(`./events-${sheetId}.json`, JSON.stringify(events));
      message.channel.send(
        `Event with ID ${eventId} has been modified in sheet ${sheetName}`
      );
      break;
    case "list":
      // send the list of events for the specified sheet as a message
      message.channel.send(
        `Events for sheet ${sheetName}:\n${events
          .map(
            (item) =>
              `ID: ${item.id}, Trigger: ${item.trigger}, Message: ${item.message}, Channel: ${item.channel}`
          )
          .join("\n")}`
      );
      break;
    default:
      message.channel.send(
        `Invalid subcommand. Use ${prefix}help to see available commands.`
      );
  }
}

function handleCommand(message: Discord.Message) {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args[0].toLowerCase();
  switch (command) {
    case "help":
      sendHelpMessage(message);
      break;
    case "author":
      manageAuthors(message, args);
      break;
    case "sheet":
      manageSheets(message, args);
      break;
    case "event":
      manageEvents(message, args);
      break;
    default:
      message.channel.send(
        `Invalid command. Use ${prefix}help to see available commands.`
      );
  }
}