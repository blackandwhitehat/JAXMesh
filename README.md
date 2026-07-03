# JaxMesh

**The home base for Jacksonville's Meshtastic community.** [JaxMesh.com](https://jaxmesh.com)
is an interactive, living hub that shows what a mesh network is, points newcomers at every
resource they need to get on the air, and tells locals when and where the community meets.
It is proudly operated by [CommsForAll](https://commsforall.com).

Meshtastic is off-grid, long-range radio mesh networking on cheap LoRa hardware: no cell
service, no internet, no subscription. JaxMesh makes that idea click and gives our local
network a front door.

## What it does

- **Shows the mesh in motion.** An animated hub-and-node visualization sends packets
  hopping between nodes, so visitors see how data moves through a mesh instead of reading
  a static diagram.
- **Every node is a doorway.** Click a node to open a panel of curated resources for that
  category: Official Resources, Guides and Getting Started, Maps and Diagnostics, Server
  Software, Local Software, Hacks and Projects, and Hardware Stores.
- **Never goes stale.** Those panels are pulled live from the community-maintained
  [Awesome Meshtastic](https://github.com/ShakataGaNai/awesome-meshtastic) list, so any PR
  merged upstream shows up here automatically, with no content to duplicate or maintain.
- **Connects the community.** Mission, meetup time and place, and links to our Discord
  where updates get posted.
- **Light and dark mode.**

## Tech

Vanilla HTML, CSS, and JavaScript, no framework and no build step. The packet animations
and wave effects are pure CSS and canvas. `jaxmeshsections.js` fetches the Awesome
Meshtastic README at load time and renders each section into its matching panel.

| File | Purpose |
|------|---------|
| `index.html` | The full single-page hub, styles, and animation |
| `jaxmeshsections.js` | Fetches and renders the Awesome Meshtastic sections into panels |
| `jaxmeshlogo.png`, `panda-hero.png` | Branding assets |

## Run it

No build required. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Serving over HTTP (rather than `file://`) lets the live fetch from GitHub work. The site
deploys as static files on Cloudflare Pages.

## Fork it for your community

The structure is deliberately adaptable. Fork this repo, swap the branding and meetup
details, and you have a hub for your own local Meshtastic group that stays current with
the broader community's resource list. MIT licensed.
