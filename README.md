# aravindajithkumar02.github.io

Source code of my portfolio site: **https://aravindajithkumar02.github.io**

I'm a mechanical engineer and M.Sc. student (Electromobility-ACES, FAU Erlangen-Nürnberg),
working on robotic tooling, control and robot simulation.

## How the site is built

- Plain HTML, CSS and JavaScript. No framework, no build step.
- Hosted on GitHub Pages: every push to `main` redeploys the site.
- The robot arm in the header is a live two-link inverse kinematics demo (`js/arm.js`).
- All project content lives in one data file (`data/projects.js`); the page builds
  the project cards from it, so adding a project never touches the design.

## Structure

```
index.html          page structure and fixed text
css/style.css       styling (colours and fonts defined at the top)
js/main.js          builds project cards and the detail view
js/arm.js           interactive robot arm (2-link inverse kinematics)
data/projects.js    project data, earlier work, 3D-printing gallery
assets/             images and link-preview image
```

## Adding a project

1. Put images in `assets/img/` (JPEG, about 1400 px wide, under 300 KB).
2. In `data/projects.js`, copy an existing project block, paste it at the top of the list, and edit it.
3. Commit and push. The live site updates in about a minute.

## Contact

[LinkedIn](https://www.linkedin.com/in/aravind-ajithkumar02)