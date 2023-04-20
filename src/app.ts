import { Client, Intents } from "discord.js";
import { Interaction, InteractionResponseType } from "discord-interactions";
import { authorize, google, sheets_v4 } from "googleapis";
import { join } from "path";
import { open } from "better-sqlite3";
import { readFileSync } from "fs";
import {  } from "./utils";

// Initialize Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load bot token from environment variable
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Discord token not found");
  process.exit(1);
}

// Load Google Sheets credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || "{}");
const { client_secret, client_id, redirect_uris } = credentials.installed;
const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Load Google Sheets API key from environment variable
const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

// Load SQLite database
const db = open(join(__dirname, "..", "data", "lorian.db"));

// Load bot commands and interactions
const commands = JSON.parse(readFileSync(join(__dirname, "commands.json"), "utf8"));

// Initialize Google Sheets API client
async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  const accessToken = await auth.getAccessToken();
  return google.sheets({ version: "v4", auth: apiKey, headers: { Authorization: `Bearer ${accessToken}` } });
}

// Get author by Discord ID
function getAuthorById(id: string): Author | null {
  const stmt = db.prepare("SELECT * FROM authors WHERE id = ?");
  return stmt.get(id);
}

// Get author by Discord role ID
function getAuthorByRoleId(id: string): Author | null {
  const stmt = db.prepare("SELECT * FROM authors WHERE role_id = ?");
  return stmt.get(id);
}

// Check if author is authorized to use bot
function isAuthorized(authorId: string): boolean {
  const author = getAuthorById(authorId);
  if (author) return true;
  const guild = client.guilds.cache.first();
  if (guild) {
    const member = guild.members.cache.get(authorId);
    if (member) {
      const roles = member.roles.cache.map((role) => role.id);
      return roles.some((roleId) => getAuthorByRoleId(roleId) !== null);
    }
  }
  return false;
}

// Get sheet by name or ID
function getSheet(sheet: string): Sheet | null {
  const stmt = db.prepare("SELECT * FROM sheets WHERE name = ? OR id = ?");
  return stmt.get(sheet, sheet);
}

// Get all sheets for guild
function getSheetsForGuild(guildId: string): Sheet[] {
  const stmt = db.prepare("SELECT * FROM sheets WHERE guild_id = ?");
  return stmt.all(guildId);
}

// Get event by name
function getEvent(sheetId: string, event: string): Event | null {
  const stmt = db.prepare("SELECT * FROM events WHERE sheet_id = ? AND name = ?");
  return stmt.get(sheetId, event);
}

// Get all events for sheet
function getEventsForSheet(sheetId: string): Event[] {
  const stmt = db.prepare("SELECT * FROM events WHERE sheet_id = ?");
  return stmt.all(sheetId);
}

// Process Discord interaction
