import * as Discord from 'discord.js';

// format that the api returns data in
export interface IApiData {
    name: string;
    display_name: string;
    rank: {
        last_week: number;
        last_month: number;
        last_day: number;
    };
    dau: {
        last_week: number;
        last_month: number;
        last_day: number;
    };
    tx: {
        last_week: number;
        last_month: number;
        last_day: number;
    };
    volume: {
        sbd: {
            last_week: number;
            last_month: number;
            last_day: number;
        };
        steem: {
            last_week: number;
            last_month: number;
            last_day: number;
        };
    };
    rewards: {
        sbd: {
            last_week: number;
            last_month: number;
            last_day: number;
        };
        steem: {
            last_week: number;
            last_month: number;
            last_day: number;
        };
    };
    image: string;
    short_description: string;
    link: string;
    accounts: [{
        logo: boolean;
        id: number;
        name: string;
    }];
}

// argument string object
export interface IArgs {
    [key: string]: string;
}

// argument 'array' object
export interface IArgTypes {
    [key: number]: IArgs;
}

export const argTypes: IArgTypes = {
    0: {
        app: "app",
        dapp: "dapp",
        interfaces: "interfaces",
        project: "project",
    },
    1: {
        content_discovery: "content_discovery",
        development: 'development',
        education: "education",
        entertainment: "entertainment",
        exchanges: "exchanges",
        finance: "finance",
        gambling: "gambling",
        games: "games",
        health: "health",
        interface: "interface",
        media: "media",
        promotion: "promotion",
        security: "security",
        social: "social",
        utility: "utility",
        wallet: "wallet",
    },
    2: {
        dau: "dau",
        default: "rank",
        rewards_sbd: "rewards_sbd",
        rewards_steem: "rewards_steem",
        tx: "tx",
        volume_sbd: "volume_sbd",
        volume_steem: "volume_steem",
    },
    3: {
        default: "last_month",
        last_day: "last_day",
        last_month: "last_month",
        last_week: "last_week",
    },
    4: {
        asc: "asc",
        default: "desc",
        desc: "desc",
    },
};

// string array string key object
export interface IQueryObject {
    [key: string]: string[];
}

// holds string arrays with all strings needed for each parameter. indexed into using the parameter
export const queries: IQueryObject = {
    app: [
        "type=app",
        "Applications",
    ],
    asc: [
        "order=asc",
        "(Ascending)",
    ],
    content_discovery: [
        "category=content_discovery",
        "Content Discovery",
    ],
    dapp: [
        "type=dapp",
        "dApps",
    ],
    dau: [
        "sort=dau",
        "By Daily Active Users",
        "dau",
    ],
    desc: [
        "order=desc",
        "(Descending)",
    ],
    development: [
        "category=development",
        "Development",
    ],
    education: [
        "category=education",
        "Education",
    ],
    entertainment: [
        "category=entertainment",
        "Entertainment",
    ],
    exchanges: [
        "category=exchanges",
        "Exchanges",
    ],
    finance: [
        "category=finance",
        "Finance",
    ],
    gambling: [
        "category=gambling",
        "Gambling",
    ],
    games: [
        "category=games",
        "Games",
    ],
    health: [
        "category=health",
        "Health",
    ],
    interface: [
        "category=interface",
        "Interface",
    ],
    interfaces: [
        "type=interface",
        "Interfaces",
    ],
    last_day: [
        "time=last_day",
        "Today",
        "last_day",
    ],
    last_month: [
        "time=last_month",
        "This Month",
        "last_month",
    ],
    last_week: [
        "time=last_week",
        "This Week",
        "last_week",
    ],
    media: [
        "category=media",
        "Media",
    ],
    project: [
        "type=project",
        "Projects",
    ],
    promotion: [
        "category=promotion",
        "Promotion",
    ],
    rank: [
        "sort=rank",
        "By Ranking",
    ],
    rewards_sbd: [
        "sort=rewards_sbd",
        "By SBD Rewards",
        "rewards",
        "sbd",
    ],
    rewards_steem: [
        "sort=rewards_steem",
        "By STEEM Rewards",
        "rewards",
        "steem",
    ],
    security: [
        "category=security",
        "Security",
    ],
    social: [
        "category=social",
        "Social",
    ],
    tx: [
        "sort=tx",
        "By Transactions",
        "tx",
    ],
    utility: [
        "category=utility",
        "Utility",
    ],
    volume_sbd: [
        "sort=volume_sbd",
        "By SBD Volume",
        "volume",
        "sbd",
    ],
    volume_steem: [
        "sort=volume_steem",
        "By STEEM Volume",
        "volume",
        "steem",
    ],
    wallet: [
        "category=wallet",
        "Wallet",
    ],
};

export interface IDiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

/**
 * embed message interface for discord
 */
export interface IDiscordEmbed {
    author?: {
        name: string;
        url: string;
        icon_url: string;
    };
    title?: string;
    description: string;
    url?: string;
    color: number;
    timestamp?: string;
    thumbnail?: {
        url: string;
    };
    fields?: IDiscordEmbedField[];
}

/**
 * message interface for discord, with embed and optional content field
 */
export interface IDiscordStartMessage {
    content?: string;
    embed: IDiscordEmbed;
}

export interface IEmbeds {
    embeds: IDiscordEmbed[];
}

export interface IDiscordWebhookManager {
    [key: string]: Discord.Webhook;
}

export const helpMessage: string = `\nThank you for using the Steem Apps Bot! Command prefixes are \
! and $. Commands are help (which shows this message), and top, which shows the top Steem Apps Ranked. \
The parameters you can pass to top are:\nTime: last_day, last_week, or last_month.\nSort: desc or \
asc.\nRank by: dau, tx, rewards_steem, rewards_sbd, volume_steem, volume_sbd.\nOnly one of each \
parameter type can be passed. Thank you again for using Steem Apps!`;