import fs from "fs";

export const sendStartMessage = async (ctx) => {
    const helperCommand = `<b>Welcome to 'Your Speaking Friend'! I'm here to help you practice and improve your English conversation skills. Whether you're a beginner or advanced, you can speak with different people in your level. I'll help you enhance your vocabulary, grammar, and fluency. Let's embark on this journey to better English together.</b>\n
<b>/start</b> - <i>Start bot</i>\n
<b>/chat</b> - <i>Start new chat</i>\n
<b>/end</b> - <i>End chat or queue</i>\n
<b>/test</b> - <i>Start an English test</i>\n
<b>/myid</b> - <i>Your chat id</i>\n
<b>/help</b> - <i>Command list</i>\n`;

    const photoPath = 'C:/Users/mehed/OneDrive/Masaüstü/Telegram Bot Full/Telegram/public/img/2.jpg';

    try {
        await ctx.replyWithPhoto({ source: fs.createReadStream(photoPath) }, {
            caption: helperCommand,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('Error sending photo:', error);
    }
};