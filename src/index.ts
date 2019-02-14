import * as Discord from 'discord.js';
import fs = require('fs');
import rp = require('request-promise-native');
import { 
    argTypes, 
    helpMessage, 
    IApiData, 
    IDiscordEmbedField,
    IDiscordStartMessage,
    queries,
    } from './defs';

const client = new Discord.Client();

const uri = 'https://steemapps.com/api/apps';

import * as config from '../config';

const options: rp.RequestPromiseOptions = {
    headers: {
        'Content-Type': 'application/json',
    },
    json: true, // Automatically parses the JSON string in the response
};

function capitalize(str: string) {
    return str && str[0].toUpperCase() + str.slice(1);
}

// gets the parameter path for the api using passed params
function getPath(qs: string[][]): string {
    let path = "/?";
    
    for (const q of qs) {
        path += (path.length > 2 ? "&" : "") + q[0];
    }

    return path;
}

// returns top of message with the sort time and order
function getSort(qs: string[][]): string {
    const sortmsg = "Sorted by " + qs[qs.length - 2][1] + " " + qs[qs.length - 3][1] + " " + qs[qs.length - 1][1];

    return sortmsg;
}

// parses command arguments and returns query array
// returned query array always has at least length 3
function parseArgs(args: string[]): string[][] {
    const qs: string[][] = [];

    // push defaults into query array if no parameters passed
    if (args.length === 0) {
        qs.push(queries[argTypes[2].default]);
        qs.push(queries[argTypes[3].default]);
        qs.push(queries[argTypes[4].asc]);
        return qs;
    }

    // decrease type when API endpoints become available for type and category
    let type = 0;
    while (type < config.argMax) {
        let parsed = false;
        
        // iterate through args, checking against each division of the api
        // it is split up to ensure correct indexing into array in other functions (see formatMessage)
        if (args.length !== 0) {
            args.forEach((element, index) => {
                if (argTypes[type].hasOwnProperty(element)) {
                    qs.push(queries[element]);
                    args.splice(index, 1);
                    parsed = true;
                }

                // console.log(element + " " + index);
            });
        }

        // if arg is not parsed in a parameter type, push the default for that type into query
        // app type and app category num have defaults in api, so not added to params
        if (type > config.appCategoryNum && !parsed) {
            // if type is at sort order, check if sort type is rank
            // if so, default is ascending
            // otherwise, default is descending
            if (type === config.sortOrderNum && qs[qs.length - 2] === queries.rank) {
                qs.push(queries[argTypes[type].asc]);
            } else {
                qs.push(queries[argTypes[type].default]);
            }
        }

        type++;
    }

    return qs;
}

/**
 * formatEmbedField takes an app and the time parameter and returns an embed field for that app
 * @param app the app to format a field for
 * @param time the time parameter passed by user or default time param
 */
function formatEmbedField(app: IApiData, time: string): IDiscordEmbedField {
    const field: IDiscordEmbedField = {
        name: app.rank[time] + ". " + app.display_name,
        value: '',
    };

    // add each of the values for time period to app string
    field.value += app.dau[time].toLocaleString('en') + " Users | ";
    field.value += app.tx[time].toLocaleString('en') + " Transactions | ";
    field.value += app.volume.steem[time].toLocaleString('en') + " STEEM Volume | ";
    field.value += '[Link](' + app.link + ')';

    return field;
}

/**
 * formatMessageFields takes the apps from the api and the user queries and returns a full message
 * using discord's embed fields
 * @param apps an array of the apps returned by the api
 * @param qs the user and/or default queries
 */
function formatMessageFields(apps: IApiData[], qs: string[][]): Discord.RichEmbed {
    const msg: IDiscordStartMessage = {
        embed: {
            color: config.embedColor,
            description: getSort(qs),
            fields: [],
            title: 'Top 10 Steem Apps',
            url: 'https://discordapp.com', 
        },
    };

    const embed = new Discord.RichEmbed(msg.embed);

    // for top 10 apps, format the embed field

    for (const app of apps.slice(0, 10)) {
        embed.fields.push(formatEmbedField(app, qs[qs.length - 2][2]));
    }

    return embed;
}

// print out in console when logged in
client.on('ready', () => {
    console.log("Logged in to Discord.");
});

// main logic - check message for ! or $, if valid command, return ranking / helpmessage
client.on('message', async (msg: Discord.Message) => {
    // don't respond to bots
    if (msg.author.bot) {
        return;
    }

    // if msg.content is null, return
    if (!msg.content) {
        return;
    }

    // only responed to bot commands
    if (msg.content.indexOf('!') !== 0 && msg.content.indexOf('$') !== 0) {
        return;
    }

    // split message by spaces, removing the command prefix
    const args = msg.content.slice(1).trim().split(/ +/g);
    if (args && Array.isArray(args) && msg.channel instanceof Discord.TextChannel) {
        const channel = msg.channel;
        const command = args.shift();

        if (command === "steemapps") {
            msg.channel.send(helpMessage);
        }
        
        // check correct command
        if (command !== "top") {
            // return an error in discord
            return;
        }

        // create query array
        const q: string[][] = parseArgs(args);

        // gets the api parameters from array
        const path = getPath(q);
        
        // call the request with uri and path, then format message to send back
        rp(uri + path, options)
        .then((apps) => {
            // pass the array of IApiData, queries, and the msg (for the channel) to main function
            // sendResponse(apps.apps, q, channel);
            const returnmsg = formatMessageFields(apps.apps, q);
            channel.send("Live data directly from SteemApps.com.\n\nFor more options type: `$steemapps`", 
                        returnmsg).catch((error) => console.log(error));
        })
        .catch((error) => {
            console.log(error);
        });
    }
});

client.login(config.token);