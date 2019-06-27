# WGLT Roguelike Tutorial

Implementation of [/r/roguelikedev](https://reddit.com/r/roguelikedev/)'s annual [Roguelike Tutorial](https://www.reddit.com/r/roguelikedev/comments/br1sv3/roguelikedev_does_the_complete_roguelike_tutorial/) using [TypeScript](https://www.typescriptlang.org/) and [WGLT](https://wglt.js.org/).

Goals:
* TypeScript for modern, statically typed browser development
* Mobile web and touch support

## Development

Clone:
```
git clone git@github.com:codyebberson/wglt-roguelike-tutorial.git
```

Start webpack:
```
npm run dev
```

## Notes

These docs assume some basic familiarity with Node, npm, and TypeScript.

If you've never used TypeScript, but you have used JavaScript, then you should
be able to follow along.  Please forgive my efforts to convert you.

### Part 0 - Setting Up

npm dependencies:
* [typescript](https://www.npmjs.com/package/typescript) - to be able to use the TypeScript language
* [webpack](https://www.npmjs.com/package/webpack) and [webpack-cli](https://www.npmjs.com/package/webpack-cli) - to bundle everything into a single .js output
* [ts-loader](https://www.npmjs.com/package/ts-loader) - to connect webpack and typescript
* [wglt](https://www.npmjs.com/package/wglt) - for roguelike development

### Part 1 - Drawing the ‘@’ symbol and moving it around

Most of this exercise is provided for free by WGLT.  The main task is to initialize the WGLT library.

### Part 2 - The generic Entity, the render functions, and the map

Almost everything is provided for free by WGLT.  Added some test walls to the otherwise empty map.

### Part 3 - Dungeon generation

Verbatim port of the Python tutorial to Typescript.

### Part 4 - Field of View

Nothing to do!  Field of view is included in the WGLT library.  The only notable difference is that WGLT darkens (50% alpha black overlay) tiles, whereas the Python tutorial uses different colors entirely.

## Credits:
* Art from [Scroll-o-Sprites](https://www.reddit.com/r/roguelikedev/comments/1dmbxr/art_scrollosprites/)
