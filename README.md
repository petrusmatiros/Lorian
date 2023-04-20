<p align="center">
<img width="128px" src="src/assets/lorian.svg" alt="Lorian logo. a handsome and helpful penguin" width=32 style="vertical-align:middle">
<h1 align="center">Lorian</h1>
</p>

## Table of Contents
- [Project description](#project-description)
- [Commands](#commands)
- [Help](#help)
- [Authors](#authors)
  - [Example(s):](#examples)
- [Spreadsheets](#spreadsheets)
  - [Manage spreadsheets (max 3 spreadsheets)](#manage-spreadsheets-max-3-spreadsheets)
    - [``<sheet id>``](#sheet-id)
    - [``<sheet name>``](#sheet-name)
  - [Example(s):](#examples-1)
- [Events](#events)
    - [``<event name>``](#event-name)
    - [``<sheet name>``](#sheet-name-1)
    - [``<channel>``](#channel)
    - [``<trigger>``](#trigger)
    - [``<message>``](#message)
  - [Example(s):](#examples-2)
- [Installation](#installation)
- [Dependencies](#dependencies)






## Project description
An easy-to-use and intuitive discord bot, called Lorian. Lorian allows you to send custom messages with specific conditions based on Google Sheets Syntax

## Commands

## Help

| Command | Description |
| --- | --- |
| ``/help`` | lists commands | All commands are author only |
## Authors
### Manage who can config the bot, meaning **only authors** can use the bot

### Example(s):
``/author add @user``

``/author remove @user``

``/author add @mods``

``/author remove @mods``

``/author list``


| Command | Description |
| --- | --- |
| ``/author add`` \<discord id\> OR \<role\> | Add author |
| ``/author remove`` \<discord id\> OR \<role\> | Remove author |
| ``/author list`` \<discord id\> OR \<role\> | List all authors |

## Spreadsheets 
### Manage spreadsheets (max 3 spreadsheets)

##### ``<sheet id>``
the  **id** in the url of the spreadsheet. For example, if the url is ``https://docs.google.com/spreadsheets/d/1X2Y3Z/edit#gid=0``, the id is ``1X2Y3Z``
##### ``<sheet name>``
unique alias name you give to the spreadsheet

### Example(s):
``/sheet add sheet1 1X2Y3Z``

``/sheet modify sheet1 sheet2``

``/sheet remove sheet1``

``/sheet list``


| Command | Description |
| --- | --- |
| ``/sheet add`` \<sheet name\> \<sheet id\> | Add a new spreadsheet |
| ``/sheet modify`` \<new sheet name\> OR \<new sheet id\> | Modify an existing spreadsheet |
| ``/sheet remove`` \<name\> OR \<sheet id\> | Remove an existing spreadsheet |
| ``/sheet list`` | List all spreadsheets |

## Events
### Manage events on a respective spreadsheet (max 10 events per spreadsheet)
#### When modifying an event, the input arguments are optional meaning that any argument left unset, will just keep that value unchanged

##### ``<event name>``
unique alias name you give to the event
##### ``<sheet name>``
unique alias name you give to the spreadsheet
##### ``<channel>``
the text channel where the message will be sent
##### ``<trigger>``
a Google Sheets Expression that you want to trigger the event. If the expression is **true**, the message will be sent, otherwise no message will be sent
##### ``<message>``
a message that is sent when the trigger condition is true. By using the syntax ``{A1}``, the value of A1 will be inserted into the message

### Example(s):
``/event add event1 sheet:sheet1 in:#general trigger:=A1=1 message:{A1} is here!``

``/event modify event1 sheet:sheet2 in:#notifications trigger:=A1=2 message:{A1} has joined!``

``/event remove event1``

``/event list sheet2``


| Command | Description |
| --- | --- |
| ``/event add`` \<event name\> sheet: \<name\> OR \<sheet id\> in:\<channel\> trigger:\<trigger\> message:\<message\> | Add a new event to an existing spreadsheet |
| ``/event modify`` \<event name\> sheet: \<new sheet id\> in:\<new channel\> trigger:\<new trigger\> message:\<new message\> | Modify an event on an existing spreadsheet |
| ``/event remove`` \<event name\> | Remove an event from an existing spreadsheet |
| ``/event list`` \<sheet name\> OR \<sheet id\> | List all events on an existing spreadsheet |


## Installation
```
npm i
npm run build
```

## Dependencies
```json
"axios": "^1.3.6",
"better-sqlite3": "^8.3.0",
"discord-interactions": "^3.3.0",
"discord.js": "^14.9.0",
"dotenv": "^16.0.3",
"express": "^4.18.2",
"express-session": "^1.17.3",
"googleapis": "^118.0.0",
"typescript": "^5.0.4"
```


