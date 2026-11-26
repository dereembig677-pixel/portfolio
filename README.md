# Paco's portfolio — simple guide

| File | What it is |
|---|---|
| `index.html` | **All the text and links.** The only file you normally edit. |
| `styles.css` | How it looks. No need to touch. |
| `script.js` | The scroll animations and the video player. No need to touch. |
| `videos/` | The 5 reels, the AI video, and their cover pictures (`.jpg`). |
| `images/` | Spare folder for extra pictures. |
| `fonts/` | The Persian font. Don't touch. |

## Changing things
Open `index.html` on GitHub, click the ✏️ pencil, and look for **✏️** comments. Change only the words between the tags, then click **Commit changes**. The live site updates in about a minute.

## Colours
The personal brand is "Pako red": warm black, cream, and a signature camera-REC red (#ff4a2b), with a camera viewfinder look. To change it, edit the `✏️` colour block at the top of `styles.css`.

## Replacing a video
1. Make it small first: 720 px wide, ideally under 10 MB. Cloudflare refuses any single file over 25 MB.
2. Upload it into `videos` with the same name (for example `reel-2.mp4`) to replace the old one. Also upload a cover picture with the matching name (`reel-2.jpg`).
3. To change a title, edit the `<b>` (title) and `<small>` (description) text for that reel in `index.html`.

## Telegram
Every Telegram button points to `https://t.me/ipxwill`.
