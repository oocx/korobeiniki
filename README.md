# Korobeiniki - a tetris sample made with Angular

This project is a tetris clone made with Angular 9. I created it as a sample application for a [blog series on web development with Angular](https://medium.com/@oocx/game-development-with-angular-how-to-develop-your-own-tetris-clone-2e95f7af3a7e?sk=9cd2e1aad502541c3b31f53115236fb5). My primary goal was not to create just another tetris clone, but to have a high quality sample application for my blog posts, and to practice my Angular skills in a fun way.

## Features

- Single- and two player tetris game
- Mostly follows the [Tetris guideline](https://tetris.fandom.com/wiki/Tetris_Guideline).
- Keyboard and gamepad support
- Stereo sound effects
- Contains a collection of great creative commons tetris music
- Online High Score
- Playable on the Xbox by loading it in the Xbox web browser

This sample shows you how to implement all these features in a browser application with Angular and TypeScript.

Besides showing how to implement all the features listed above, this sample also demonstrates

- how to separate game logic from the technical aspects of the game (graphics, sound, input)
- how to write high performance (60 fps) Angular applications by fine tuning change detection and running your app without zone.js
- how to use free cloud services to develop and host your application (Google Firebase, github, Azure Devops, ZEIT)

## Music, sound and graphics credits

I used various creative commons music, sound effects and graphics. See [3rd-party.md](3rd-party.md) for a full list. Thanks to everyone who created these great resources and published them under a creative commons license!

# Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Development server

Run `npm run start:dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. This generates a production build.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

The test coverage is embarrassingly low though...

## Firebase configuration

This game uses a google Firestore database to store high scores. You need to provide your own Firebase configuration to use the high score feature. See [webpack.partial.js](webpack.partial.js) for a list of environment variables that are used to configure Firebase.

