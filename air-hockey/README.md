# air hockey

An in-progress experiment with collision detection in an air hockey game. Uses touch and arrow keys to control the player and spacebar to pause the game.


## Base Dependencies
- node/npm ~0.10.26 (http://nodejs.org/)
- grunt-cli ~0.4 (http://gruntjs.com/getting-started)
- ruby (already installed on OSX)
- sass ~3.3 (http://sass-lang.com/install)


## Project Installation - NPM
This project can be installed locally using npm. After checking the project out from source control, `cd` to the root directory where package.json is located, and `npm install .`.


## Workflow
All development work should be done in the 'src' directory. Use the grunt commands below for running the project locally and processing for deployable files.


## Using grunt in the Terminal
`cd` to the trunk directory with the Gruntfile.js and use the following commands:

- `grunt run` : runs a local static server with automatic live-reloading on port http://localhost:8008. Lints javascript, compiles SASS, and copies all files over to a 'local' folder that the static server points to. Watches all files for changes.
- `grunt build` : packages all files for delivery to staging or production, output to a 'public' folder. Lints javascript, optimizes javascript, compiles and minifies CSS.
