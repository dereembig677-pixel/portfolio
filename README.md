# Paco's portfolio — simple guide

| File | What it is |
|---|---|
| `index.html` | **All the text and links.** The only file you normally edit. |
| `styles.css` | How it looks. No need to touch. |
| `script.js` | The scroll animations and the video player. No need to touch. |
| `images/` | Put cover pictures here. |
| `fonts/` | The Persian font. Don't touch. |

## Changing things
Open `index.html` on GitHub, click the ✏️ pencil, and look for **✏️** comments. Change only the words between the tags, then click **Commit changes**. The live site updates in about a minute.

## Adding your videos
There are **5 reel slots** and **1 AI slot**. In `index.html`, find each `href="#"` under the ✏️ notes and replace `#` with the video link:
- an Instagram reel link (`https://www.instagram.com/reel/...`)
- a YouTube Shorts or YouTube link
- an Aparat or Vimeo link
- or your own video file: upload `reel1.mp4` into `images`, then use `images/reel1.mp4`

Clicking a slot then plays the video right on the page. Keep video files small (under ~20 MB each).

## Adding a cover picture
1. Upload the picture into the `images` folder (for example `reel1.jpg`).
2. Add `style="--img:url('images/reel1.jpg')"` inside that slot's `<a class="reel …">` tag.

## Telegram
Every Telegram button points to `https://t.me/ipxwill`. To change it, replace that link everywhere it appears in `index.html`.
