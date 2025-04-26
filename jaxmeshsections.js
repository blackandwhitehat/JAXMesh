// This script will replace the content of the 7 sections in jaxmesh-improved.html
// with data dynamically fetched from the Awesome Meshtastic GitHub repo

document.addEventListener('DOMContentLoaded', function() {
    console.log('Meshtastic sections script loaded');
    
    // Define the mapping between awesome-meshtastic sections and panel IDs
    const sectionMapping = [
        { panelId: 'official-resources', title: 'Official Resources', sectionPattern: /## Official Resources/, endPattern: /## Guides & Getting Started/ },
        { panelId: 'guides-getting-started', title: 'Guides & Getting Started', sectionPattern: /## Guides & Getting Started/, endPattern: /## Maps and Diagnostics/ },
        { panelId: 'maps-diagnostics', title: 'Maps and Diagnostics', sectionPattern: /## Maps and Diagnostics/, endPattern: /## Server Software/ },
        { panelId: 'server-software', title: 'Server Software', sectionPattern: /## Server Software/, endPattern: /## Local Software/ },
        { panelId: 'local-software', title: 'Local Software', sectionPattern: /## Local Software/, endPattern: /## Hacks and Projects/ },
        { panelId: 'hacks-projects', title: 'Hacks and Projects', sectionPattern: /## Hacks and Projects/, endPattern: /## Hardware Stores/ },
        { panelId: 'hardware-stores', title: 'Hardware Stores', sectionPattern: /## Hardware Stores/, endPattern: /## Contributing/ }
    ];

    // Function to fetch the latest README from GitHub
    async function fetchAwesomeMeshtastic() {
        try {
            // Fetch the raw content of the README.md file
            const response = await fetch('https://raw.githubusercontent.com/ShakataGaNai/awesome-meshtastic/main/README.md');
            
            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }
            
            const markdownContent = await response.text();
            console.log('Successfully fetched Awesome Meshtastic README');
            
            // Parse the content into sections
            parseMarkdownAndUpdateUI(markdownContent);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Use fallback content if fetch fails
            useFallbackContent();
        }
    }

    // Function to parse the Markdown content and extract sections
    function parseMarkdownAndUpdateUI(markdown) {
        console.log('Parsing markdown and updating UI...');
        
        // Process each section
        sectionMapping.forEach(section => {
            let sectionContent = extractSectionContent(markdown, section.sectionPattern, section.endPattern);
            
            if (sectionContent) {
                // Clean up the "back to top" text first before conversion to HTML
                sectionContent = sectionContent.replace(/\[\^ back to top \^\]\([^)]+\)/g, '');
                sectionContent = sectionContent.replace(/\*\*\^ back to top \^\*\*/g, '');
                sectionContent = sectionContent.replace(/\^ back to top \^/g, '');
                
                // Convert markdown to HTML
                sectionContent = convertMarkdownToHTML(sectionContent);
                
                // Update the panel
                updatePanel(section.panelId, section.title, sectionContent);
            } else {
                console.warn(`Section "${section.title}" not found in README`);
            }
        });
    }

    // Function to extract section content from markdown
    function extractSectionContent(markdown, startPattern, endPattern) {
        const startMatch = markdown.match(startPattern);
        if (!startMatch) return null;
        
        const startIndex = startMatch.index + startMatch[0].length;
        
        let endIndex;
        const endMatch = markdown.substr(startIndex).match(endPattern);
        if (endMatch) {
            endIndex = startIndex + endMatch.index;
        } else {
            endIndex = markdown.length;
        }
        
        return markdown.substring(startIndex, endIndex).trim();
    }

    // Function to convert markdown to HTML (basic implementation)
    function convertMarkdownToHTML(markdown) {
        // Process links - [text](url)
        let html = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Process lists
        html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
        html = html.replace(/<li>.*?<\/li>(\n|$)/gs, '<ul>$&</ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        // Process headings
        html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        
        // Process paragraphs
        html = html.replace(/^([^<\n].*?)$/gm, '<p>$1</p>');
        html = html.replace(/<p>\s*<\/p>/g, '');
        
        // Clean up any double paragraph tags
        html = html.replace(/<p><p>/g, '<p>');
        html = html.replace(/<\/p><\/p>/g, '</p>');
        
        // Remove the Communities section from Hardware Stores
        if (html.includes('Communities')) {
            const communitiesIndex = html.indexOf('<h2>Communities</h2>');
            if (communitiesIndex !== -1) {
                html = html.substring(0, communitiesIndex);
            } else {
                const altCommunitiesIndex = html.indexOf('## Communities');
                if (altCommunitiesIndex !== -1) {
                    html = html.substring(0, altCommunitiesIndex);
                }
            }
        }
        
        // Clean HTML to remove any remaining back to top links
        html = html.replace(/<a [^>]*>\s*\^ back to top \^\s*<\/a>/gi, '');
        html = html.replace(/<a [^>]*>\s*\^.*?back.*?top.*?\^\s*<\/a>/gi, '');
        html = html.replace(/\*\*\s*\^ back to top \^\s*\*\*/gi, '');
        html = html.replace(/\*\*\s*<a [^>]*>.*?back.*?top.*?<\/a>\s*\*\*/gi, '');
        
        return html;
    }

    // Function to update panel content
    function updatePanel(panelId, title, content) {
        const panel = document.getElementById(panelId);
        if (panel) {
            // Update panel title
            const titleElement = panel.querySelector('.panel-title');
            if (titleElement) {
                titleElement.textContent = title;
            }
            
            // Update panel content
            const contentElement = panel.querySelector('.panel-content');
            if (contentElement) {
                // Add introductory text before the GitHub content
                const introText = getIntroductoryText(title);
                
                // Final cleanup of any remaining "back to top" references before display
                let cleanedContent = content;
                cleanedContent = cleanedContent.replace(/\*\*\s*\^ back to top \^\s*\*\*/gi, '');
                cleanedContent = cleanedContent.replace(/\*\*\s*<a [^>]*>.*?back.*?top.*?<\/a>\s*\*\*/gi, '');
                cleanedContent = cleanedContent.replace(/<a [^>]*>\s*\^ back to top \^\s*<\/a>/gi, '');
                cleanedContent = cleanedContent.replace(/<a [^>]*>\s*\^.*?back.*?top.*?\^\s*<\/a>/gi, '');
                
                contentElement.innerHTML = introText + cleanedContent;
            } else {
                console.warn(`Content element not found in panel ${panelId}`);
            }
        } else {
            console.warn(`Panel with ID ${panelId} not found`);
        }
    }
    
    // Function to get introductory text for each section
    function getIntroductoryText(sectionTitle) {
        const introTexts = {
            'Official Resources': '<p>Essential tools and information from the Meshtastic project team:</p>',
            'Guides & Getting Started': '<p>Resources to help you get started with Meshtastic:</p>',
            'Maps and Diagnostics': '<p>Tools for visualizing and monitoring your Meshtastic network:</p>',
            'Server Software': '<p>Server-based applications for your Meshtastic network:</p>',
            'Local Software': '<p>Applications that run on your devices to interact with Meshtastic:</p>',
            'Hacks and Projects': '<p>Creative implementations and experimental Meshtastic projects:</p>',
            'Hardware Stores': '<p>Where to purchase Meshtastic-compatible hardware:</p>'
        };
        
        return introTexts[sectionTitle] || '';
    }
    
    // Function to use fallback content if GitHub fetch fails
    function useFallbackContent() {
        console.log('Using fallback content');
        const fallbackSections = [
            {
                panelId: 'official-resources',
                title: 'Official Resources',
                content: `
                    <p>Essential tools and information from the Meshtastic project team:</p>
                    
                    <ul>
                        <li><a href="https://meshtastic.org/" target="_blank">Meshtastic.org</a> - The official project website</li>
                        <li><a href="https://github.com/meshtastic" target="_blank">GitHub Organization</a> - All official source code repositories</li>
                        <li><a href="https://meshtastic.org/docs/" target="_blank">Documentation Hub</a> - Comprehensive user and developer guides</li>
                        <li><a href="https://meshtastic.discourse.group/" target="_blank">Discussion Forum</a> - Community support and discussions</li>
                        <li><a href="https://t.me/meshtasticorg" target="_blank">Telegram Group</a> - Chat with the Meshtastic community</li>
                        <li><a href="https://explorer.meshtastic.org/" target="_blank">Explorer</a> - Public device info explorer</li>
                    </ul>
                `
            },
            {
                panelId: 'guides-getting-started',
                title: 'Guides & Getting Started',
                content: `
                    <p>Resources to help you get started with Meshtastic:</p>
                    
                    <ul>
                        <li><a href="https://youtu.be/TY6m6fS8bxU" target="_blank">What is Meshtastic?</a> - Introductory video explaining core concepts</li>
                        <li><a href="https://austinmesh.org/wiki/How_Does_It_Work" target="_blank">How Does It Work</a> - Technical overview from AustinMesh</li>
                        <li><a href="https://youtu.be/zLKMz0PYvRQ" target="_blank">Getting Started</a> - Setup tutorial by The Comms Channel</li>
                        <li><a href="https://meshtastic.org/docs/hardware/antenna/community-antenna-testing" target="_blank">Antenna Reports</a> - Community antenna testing results</li>
                        <li><a href="https://meshtastic.org/docs/hardware/antenna/connectors" target="_blank">RF Connector Guide</a> - Visual dictionary of connector types</li>
                    </ul>
                `
            },
            {
                panelId: 'maps-diagnostics',
                title: 'Maps and Diagnostics',
                content: `
                    <p>Tools for visualizing and monitoring your Meshtastic network:</p>
                    
                    <ul>
                        <li><a href="https://meshtastic.liamcottle.net/" target="_blank">Meshtastic Map</a> - Global map of all nodes reporting via MQTT</li>
                        <li><a href="https://mapper.packetmonkey.org/" target="_blank">Packet Monkey Mapper</a> - Alternative Meshtastic network mapper</li>
                        <li><a href="https://baymesh.io/map" target="_blank">BayMesh Map</a> - San Francisco Bay Area mesh network</li>
                        <li><a href="https://sacvalleymesh.net/meshinfo/" target="_blank">MeshInfo</a> - Traffic visualization and inspection tool</li>
                    </ul>
                `
            },
            {
                panelId: 'server-software',
                title: 'Server Software',
                content: `
                    <p>Server-based applications for your Meshtastic network:</p>
                    
                    <ul>
                        <li><a href="https://github.com/armos-/meshview" target="_blank">MeshView</a> - Web UI for visualizing MQTT messages with database storage</li>
                        <li><a href="https://github.com/kevinelliott/meshinfo" target="_blank">MeshInfo</a> - Python-based traffic visualization and analysis</li>
                        <li><a href="https://github.com/ppicazo/bayme.sh-bot" target="_blank">bayme.sh-bot</a> - MQTT to Discord logger for local meshes</li>
                        <li><a href="https://github.com/StrugglyDev/meshtastic-ha-entity-builder" target="_blank">Home Assistant Integration</a> - Builds entities from stored nodes</li>
                    </ul>
                `
            },
            {
                panelId: 'local-software',
                title: 'Local Software',
                content: `
                    <p>Applications that run on your devices to interact with Meshtastic:</p>
                    
                    <ul>
                        <li><a href="https://github.com/pdxlocations/Meshtastic-MQTT-Connect" target="_blank">MQTT Connect</a> - Python-based Meshtastic UI for local machines</li>
                        <li><a href="https://github.com/thebel1/multimesh" target="_blank">MultiMesh</a> - Cross-platform Meshtastic client based on Flutter</li>
                        <li><a href="https://github.com/ddrown/Meshtastic-SDR" target="_blank">Meshtastic-SDR</a> - GnuRadio and Python based replacement for hardware</li>
                        <li><a href="https://github.com/lmatte7/meshtastic-go" target="_blank">meshtastic-go</a> - A meshtastic CLI written in GoLang</li>
                    </ul>
                `
            },
            {
                panelId: 'hacks-projects',
                title: 'Hacks and Projects',
                content: `
                    <p>Creative implementations and experimental Meshtastic projects:</p>
                    
                    <ul>
                        <li><a href="https://github.com/RCGV1/Meshtastic-SAME-EAS-Alerter" target="_blank">EAS Alerter</a> - Weather Service alerts broadcaster</li>
                        <li><a href="https://github.com/thebentern/meshtastic-heartbeat" target="_blank">Heartbeat</a> - Health monitoring system using Meshtastic</li>
                        <li><a href="https://github.com/beegee-tokyo/Meshtastic-Sensor-Network" target="_blank">Sensor Network</a> - Environmental monitoring implementation</li>
                        <li><a href="https://github.com/markbirss/MeshCat" target="_blank">MeshCat</a> - Feline tracking and monitoring system</li>
                    </ul>
                `
            },
            {
                panelId: 'hardware-stores',
                title: 'Hardware Stores',
                content: `
                    <p>Where to purchase Meshtastic-compatible hardware:</p>
                    
                    <ul>
                        <li><a href="https://store.rokland.com/collections/antennas-by-frequency/868-mhz-915-mhz" target="_blank">Rokland</a> - Quality antennas and accessories</li>
                        <li><a href="https://yetiwurks.com/collections/meshtastic" target="_blank">YetiWurks</a> - Meshtastic devices and accessories</li>
                        <li><a href="https://www.tindie.com/stores/neilhao/" target="_blank">Neil Hao on Tindie</a> - For the G1 & G2 series of devices</li>
                        <li><a href="https://www.lilygo.cc/" target="_blank">LILYGO Official Site</a> - Direct from manufacturer</li>
                        <li><a href="https://www.aliexpress.com/store/2090076" target="_blank">LILYGO on AliExpress</a> - Alternative purchase option</li>
                        <li><a href="https://spec5.com/collections/meshtastic" target="_blank">Spec5</a> - Specialized Meshtastic hardware</li>
                        <li><a href="https://atlabsco.com/collections/lora" target="_blank">AT Labs</a> - LoRa devices and accessories</li>
                    </ul>
                `
            }
        ];

        // Update panels with fallback content
        fallbackSections.forEach(section => {
            updatePanel(section.panelId, section.title, section.content);
        });
    }

    // Add manual integration after loading for direct testing
    window.updateMeshtasticSections = function() {
        console.log('Manual update triggered');
        fetchAwesomeMeshtastic();
    };
    
    // Fetch the data initially
    console.log('Initial fetch starting...');
    fetchAwesomeMeshtastic();
    
    // Set up periodic refresh (once per day)
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    setInterval(fetchAwesomeMeshtastic, ONE_DAY_MS);
});