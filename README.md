# Paco's portfolio — simple guide

| File | What it is |
|---|---|
| `index.html` | **All the text and links.** The only file you normally edit. |
| `styles.css` | How it looks. No need to touch. |
| `script.js` | Fade-ins, the growing showreel, and the video player. No need to touch. |
| `images/` | Put cover pictures here. |
| `fonts/` | The Persian font. Don't touch. |

## Changing things
Open `index.html` on GitHub, click the ✏️ pencil, and look for **✏️** comments. Change only the words between the tags, then click **Commit changes**. The live site updates in about a minute.

## Adding a video
Put the YouTube, Vimeo or Aparat link in place of `#` in `href="#"` for the showreel or a project. Clicking it then plays the video right on the page.

## Adding a cover picture
1. Upload the picture into the `images` folder (for example `cover1.jpg`).
2. In `index.html`, add `style="--img:url('images/cover1.jpg')"` inside that project's `<a class="tile …">` tag.
