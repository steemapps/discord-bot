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
        interface: "interface",
    },
    1: {
        content_discovery: "content_discovery",
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
    asc: [
        "order=asc",
        "(Ascending)",
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
    tx: [
        "sort=tx",
        "By Transactions",
        "tx",
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
    
};