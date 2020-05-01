Setup
-----
1. change node version to 10+
	- nvm use 10
	- npm install 10 [if needed]
	- node --version

2. npm install
3. update config file
	- echo '[YOUR DB USER]' > mysql.user
	- echo '[YOUR DB PASS]' > mysql.pass
	- update src/mysqlconfig.js

Run
---
- npm run crawl

output will be in schema_data.sal

Debug
-----
- ndb npm run crawl

Load new schema with data
-------------------------
- mysql -u `cat mysql.user` -p`cat mysql.pass` < schema_data.sql
