# aravindajithkumar02.github.io

Personal portfolio of Aravind Ajithkumar: robotics, CAD and simulation.
Plain HTML, CSS and JavaScript, hosted on GitHub Pages. No build step.

## Files

```
index.html          page structure and the fixed text (about, skills, timeline, contact)
css/style.css       all styling (colors and fonts are defined at the top)
js/main.js          builds the project cards and detail view from the data file
js/arm.js           the live robot arm in the header (2-link inverse kinematics)
data/projects.js    ALL project data: projects, earlier work, 3D-print gallery
assets/img/         images (screenshots, photo, print photos)
assets/og-image.png link-preview image for LinkedIn (1200 × 630 px)
assets/favicon.svg  browser-tab icon
assets/Aravind_Ajithkumar_CV.pdf   the CV behind the "Download CV" buttons (add it)
```

## Adding a project

1. Put any images in `assets/img/`. Keep them under about 300 KB (JPEG, around 1400 px wide).
2. Open `data/projects.js`, copy an existing `{ ... }` project block, paste it at the
   top of the `projects` list and edit the text.
3. Save, commit, push. GitHub Pages updates the live site in about a minute.

Rule for every line: only what I did and can explain in an interview.
Work in progress is marked `"in-progress"`.

## Updating other things

- Status of a project: change `status`, `progress` and `next` in `data/projects.js`.
- Skills, timeline, about text: edit `index.html`.
- "Last updated" date: bottom of `index.html`.
- Photo: save as `assets/img/photo.jpg` (portrait, about 600 × 750 px).

## Previewing locally

Double-click `index.html`. It works without a server because the project data is
a `.js` file rather than `.json` (browsers block reading `.json` files from disk).
