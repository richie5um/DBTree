# DBTree

Simple tool to grab meta-data for all of your files in your Dropbox account, and then calculate folder sizes (for all their children files/folders).

You just need to get an access token from dropbox and then run:
* `npm install`
* `npm run compile`
* `DB_ACCESS_TOKEN="YOURTOKEN" npm run start > dbtree.json`

ToDo:
* Add a D3 TreeMap to visualize the output.
