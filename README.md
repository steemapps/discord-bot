Discord Bot for steem-apps

Dev setup:

Requires you to set up a config.ts in the src folder with your Discord Bot User's token.
`npm i`
`npm start`

Discord command:

$top
!top

Parameters:
Sort by: rewards_steem, rewards_sbd, volume_steem, volume_sbd, tx, dau
Order: asc, desc
Time Period: last_day, last_week, last_month

Default is last_month by the ranking from steem apps, the only way to get the ranking in order is not passing a sort by parameter. Parameter order does not matter.