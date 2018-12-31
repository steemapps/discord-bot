import * as Discord from 'discord.js';
import rp = require('request-promise-native');
import { argTypes, helpMessage, IApiData, IDiscordEmbed, IDiscordStartMessage, queries } from './defs';
const client = new Discord.Client();

const uri = 'https://steemapps.com/api/apps';

import * as config from '../config';

// ToDo:
// Add n limit (e.g. only show top 10 [could do this in the loop but should be api available?])
// Add categories once available through API
// Add app type once available through API
// Remove rank from non-rank sorts?

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
    let sortmsg = "Top Steem ";

    for (const q of qs) {
        sortmsg += q[1] + " ";
    }

    return sortmsg + "\n";
}

// parses command arguments and returns query array
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
    while (type < 5) {
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
        if (type > 1 && !parsed) {
            // console.log(type);
            if (type === 4 && qs[qs.length - 2] === queries.rank) {
                qs.push(queries[argTypes[type].asc]);
            } else {
                qs.push(queries[argTypes[type].default]);
            }
        }

        type++;
    }

    return qs;
}

function formatMessage(apps: IApiData[], qs: string[][]): string {
    let msg = "";
    // fixed by arg parse, order doesn't matter
    // require certain parameter order to keep formatting nice looking 
    const time = qs[qs.length - 2][2] as keyof IApiData["rank"];
    const sort = qs[qs.length - 3];

    // loop through each result from api
    for (const app of apps) {
        // print app rank and name (remove rank for non-rank sort?)
        msg += app.rank[time] + ". " + app.display_name;
        const data = app[sort[2] as keyof IApiData];
        // get data here to reduce array indexing and easier typing

        // due to arg parse func and typing, at this point there should not be any type errors.
        // casts are for the ability to index into object with a string
        if (sort[0] !== "sort=rank") {
            // if not rank, print the sort parameter
            if (sort[2] === "tx" || sort[2] === "dau") {
                // if tx or dau sort, print the time period of the rank parameter
                msg += " " + capitalize(sort[2]) + ": " + (data as IApiData["tx"])[time];
            } else {
                // for other sorts, print the correct currency type as well as correct time period
                msg += " " + capitalize(sort[2]) + " (" + sort[3].toUpperCase() + "): ";
                msg += ((data as IApiData["volume"])[sort[3] as keyof IApiData["volume"]][time]).toFixed(3);
            }
        }

        msg += "\n";
    }

    return msg;
}

/**
 * Formats a discord embed with app description, name, link, pic, etc.
 * @param app 
 */
function formatEmbed(app: IApiData): IDiscordEmbed {
    const msg: IDiscordEmbed = {
        color: 12607945,
        description: app.short_description,  
        thumbnail: {
            url: '',
        }, 
        title: app.display_name,
        url: app.link,
    };

    // if image data is in steemapps db, use it
    if (app.image && app.image.length > 0) {
        msg.thumbnail.url += app.image;
    } else {
        // else find the account with a logo on it
        const acclogo = app.accounts.filter((x) => (x.logo && x.name));
        if (acclogo[0] && Array.isArray(acclogo)) {
            // get the image link from account name steemjs? seems like a lot for pictures
            console.log(acclogo);
            console.log("https://steemitimages.com/u/" + acclogo[0].name + "/avatar");
            msg.thumbnail.url += "https://steemitimages.com/u/" + acclogo[0].name + "/avatar";
        }
    }

    return msg;
}

/**
 * formatMessages takes an api response and the queries used to format embedded discord messages
 * @param apps array of app data from steemapps api
 * @param qs queries sent by user or default if not
 */
function formatMessages(apps: IApiData[], qs: string[][]): IDiscordStartMessage[] {
    const messages: IDiscordStartMessage[] = [];

    for (const app of apps) {
        const msg: IDiscordStartMessage = {
            embed: formatEmbed(app),
        };
        
        messages.push(msg);
    }

    return messages;
}

function sendResponse(apps: IApiData[], qs: string[][], dismsg: Discord.Message) {
    // format all apps into the embedded messages
    const msgs = formatMessages(apps, qs);
    const channel = dismsg.channel;

    // send the content of message, with the sort options being used
    channel.send(getSort(qs));

    // loop through and send messages
    for (const msg of msgs) {
        channel.send(msg)
            .catch((error) => {
                console.log(error);
                console.log(msg);
            });
    }
}

// print out in console when logged in
client.on('ready', () => {
    console.log("Logged in to Discord.");
});

client.on('message', async (msg: Discord.Message) => {
    // don't respond to bots
    if (msg.author.bot) {
        return;
    }

    // only responed to bot commands
    if (msg.content.indexOf('!') !== 0 && msg.content.indexOf('$') !== 0) {
        return;
    }

    // split message by spaces, removing the command prefix
    const args = msg.content.slice(1).trim().split(/ +/g);
    if (args && Array.isArray(args)) {
        const command = args.shift();

        if (command === "help") {
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
            console.log(apps.apps.length);
            // pass the array of IApiData, queries, and the msg (for the channel) to main function
            sendResponse(apps.apps, q, msg);
        })
        .catch((error) => {
            console.log(error);
        });
    }
});

client.login(config.token);