# JaxMesh: Visualizing Our Meshtastic Community

I built this interactive visualization to showcase how the Meshtastic network works and to help newcomers understand what mesh networking is all about. Instead of boring diagrams, I wanted to create something that actually *shows* how data moves between nodes in real-time.

## What's Cool About This

- **It's alive!** The visualization shows packets zipping between nodes just like they would in a real mesh network
- **Everything's clickable** - each node opens a panel with essential resources for that category
- **No content duplication** - pulls directly from the community-maintained Awesome Meshtastic List
- **Switch between dark/light mode** depending on your preference (I'm a dark mode person myself)

## Tech Behind It

Just vanilla JavaScript, HTML and CSS - nothing fancy or complicated. I was pretty happy with how the wave animations turned out using just CSS. The packet movement has a slight arc to make it look more natural, and I made sure there's always a minimum number of packets moving to keep things interesting.

## For Our Community

Shows:
- When and where we meet 
- Links to our Discord where all updates get posted
- Quick access to all the resources someone would need to get started

Instead of maintaining our own list of resources, we tap into what the broader community is already building, so any PRs to the Awesome Meshtastic repo automatically show up on our site too!

Feel free to fork this for your own local Meshtastic community! The structure is pretty adaptable, and I'd love to see other groups use it.
