# Water Reporter

## Developers

#### Install Node Dependencies

`npm install`

#### Install Bower Dependencies

`bower install`

#### Run it locally

`grunt serve`


## Deploying waterreporter

1. Ensure the "Environment" is defined under the Gruntfile.js `ngconstant` initConfig
2. Ensure the a separate "client_id" has been setup for OAuth in your API's `client` table
3. Finally, `grunt build --config="ENVIRONMENT"` replacing ENVIRONMENT with the environment name that matches the definition in the `gruntfile.js`
