const cron = require('node-cron');
const fetch = require('node-fetch');

// Discord bot token and channel ID
const DISCORD_TOKEN = 'MTM5NTE1NTAwNjI4OTg3MDk3OQ.GtiDIC.4GLY2wzPrCNIlTMd0uos0MJ29rG3VCv5MKFnBI';
const CHANNEL_ID = '1382841821943828522'; // #chat channel
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1jlxjSLS3-O1JJYJOOKLph9xdH1Fhe5hy2XANDjC9Kkc/edit?usp=drivesdk';

// Varied engaging messages
const messages = [
    {
        text: "🔥 **New finds just dropped!** Check our Liquids Spreadsheet for the latest exclusive items. Limited stock available!",
        embed: true
    },
    {
        text: "👀 **Looking for heat?** Browse our curated collection of premium finds. What catches your eye?",
        embed: true
    },
    {
        text: "💎 **Fresh links alert!** Updated spreadsheet with new pieces. Don't miss out on these gems.",
        embed: true
    },
    {
        text: "🛍️ **Spreadsheet update incoming!** Check out what we found this week. Your next flex awaits.",
        embed: true
    },
    {
        text: "⚡ **Heads up!** New items added to the Liquids Spreadsheet. Get them before they're gone.",
        embed: true
    },
    {
        text: "🎯 **Best finds of the week** are live in our spreadsheet. Quality over quantity, always.",
        embed: true
    }
];

// Function to post to Discord
async function postToDiscord(messageIndex) {
    const message = messages[messageIndex % messages.length];
    
    const payload = {
        content: message.text,
        embeds: [
            {
                title: "📊 Liquids Spreadsheet",
                description: "Click the link below to view all our latest finds",
                url: SPREADSHEET_URL,
                color: 0x667eea,
                footer: {
                    text: "Elite Finds | Updated regularly"
                }
            }
        ]
    };

    try {
        const response = await fetch(`https://discordapp.com/api/channels/${CHANNEL_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`✅ Discord post #${messageIndex + 1} sent successfully at ${new Date().toLocaleString()}`);
        } else {
            console.error(`❌ Failed to post to Discord: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error posting to Discord:', error);
    }
}

// Cron jobs for 8 AM and 3 PM PST
let messageCounter = 0;

// 8 AM PST (16:00 UTC)
cron.schedule('0 16 * * *', () => {
    console.log('📤 Posting 8 AM PST message...');
    postToDiscord(messageCounter++);
});

// 3 PM PST (23:00 UTC)
cron.schedule('0 23 * * *', () => {
    console.log('📤 Posting 3 PM PST message...');
    postToDiscord(messageCounter++);
});

console.log('✅ Discord automation configured:');
console.log('   - 8 AM PST (16:00 UTC)');
console.log('   - 3 PM PST (23:00 UTC)');
console.log('   - 6 unique rotating messages');

// Test connection function
async function testDiscordConnection() {
    try {
        const response = await fetch(`https://discordapp.com/api/channels/${CHANNEL_ID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bot ${DISCORD_TOKEN}`
            }
        });

        if (response.ok) {
            const channel = await response.json();
            console.log(`✅ Discord connection verified. Channel: #${channel.name}`);
            return { success: true, channel: channel.name };
        } else {
            throw new Error(`Failed to verify channel: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Discord connection test failed:', error);
        throw error;
    }
}

module.exports = { postToDiscord, testDiscordConnection };
