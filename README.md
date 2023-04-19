<p align="center">
<img width="128px" src="src/assets/Lorian.svg" alt="Lorian logo. a handsome and helpful penguin" width=32 style="vertical-align:middle">
<h1 align="center">Lorian</h1>
</p>

## Table of Contents
- [Project description](#project-description)
- [Installation](#installation)
- [Dependencies](#dependencies)


## Project description
An easy-to-use and intuitive discord bot, called Lorian. Lorian allows you to send custom messages with specific conditions based on Google Sheets Syntax

## Commands
### All commands are author only:

- ``/help`` - lists commands

**Manage who can config the bot**

- ``/author`` add ``<discord id>`` OR ``<role>``

- ``/author`` remove ``<discord id>`` OR ``<role>``

- ``/author`` list ``<discord id>`` OR ``<role>``

#### Manage Spreadsheets (max 3 spreadsheets)
- ``/sheet`` add ``<sheet name>`` ``<sheet id>``

- ``/sheet`` modify ``<new sheet name>`` OR ``<new sheet id>``

- ``/sheet`` remove ``<name>`` OR ``<sheet id>``

- ``/sheet`` list

#### Manage Events (max 10 events per spreadsheet)

*Triggers use the Google Sheet Syntax*

The trigger and/or message when modifying an event, can be left undefined, which just keeps the previously set message and/or trigger.

- ``/sheet`` ``<name>`` OR ``<sheet id>`` add event ``<event id>`` trigger:``<trigger>`` message:``<message>`` in:``<channel>``

- ``/sheet`` ``<name>`` OR ``<sheet id>`` modify event ``<event id>`` trigger:``<new trigger>`` message:``<new message>`` in:``<new channel>``

- ``/sheet`` ``<name>`` OR ``<sheet id>`` remove event ``<event id>``

- ``/sheet`` ``<name>`` OR ``<sheet id>`` event list

## Installation
```
npm i
npm run build
```

## Dependencies
```json

```


