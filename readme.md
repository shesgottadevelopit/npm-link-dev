# Code Snippet: `npm-link-dev`

## Background
I clone a lot of my development projects and for the most part I'm relying primarily on developmentDependencies reflected in my `package.json`.

Right now, I do `npm install -g` a significant number of my developmentDependencies and then I `npm link` them to my project folder.

## The Problem
When I clone a project, there is no easy way to `npm link` all of the devDependencies in my `package.json` in the same way that you're able to just use `npm install` and everything listed in your package.json is installed locally.

My plan was to create a package that would:
- read a project's `package.json`, if one exists
- copy that to an object and extract the developmentDependencies to an array
- then iterate over that array, checking if that particular package is installed globally. if it is, then just run the `npm link <pkg>` command and if not, I'd either install it globally or just list it out in the terminal and decide how to proceed.

## Challenges
- For some reason, some packages (e.g. gulp) were not reflecting that they were globally installed using the following command: `npm list -g` which made it a challenge to check with accuracy.

Interim solution:
- I created a script called `devDependencies.js` and stored it in my WSL user directory (e.g. `/home/myUserName/bin`). This script is able to:
    1. check if a package.json exists. If so it copies it into an object
    2. chekcs if there is a devDependencies property in my newly created packageJSON object. If so, it will create an array with only the keys (which are basically the names of the packages in the package.json).
    3. Output a space separated list of each develop dependency.

- I created an alias in my `.bash_aliases` that is something like `npm-linkdev='node devDependencies.js'`
- This way, when I run `npm-link-dev` in a directory with a package.json that has development dependencies listed, it will output a list of those development dependencies. I can then copy that list without having to manually type them into a command like:
    - `npm link <copied list of development dependencies>` or
    - `npm-link-save -D <copied list of development dependencies>`. This is not really necessary for projects that I'm cloning, but maybe I didn't clone a project. I could still run this command in another project and just copy it to a new project.

That is it for now.

**Notes:**
- This project's package.json does not reflect development dependencies for this particular project but is a good way to test it directly from this folder.
- the `log.md` file is documentation of my learning process to figure out how to do this, even though it is still a work in progress.
- I realize this solution may not even be worth continuing to pursue since it is recommended that packages are installed locally but it was a good exercise and I learned a lot while doing it.
