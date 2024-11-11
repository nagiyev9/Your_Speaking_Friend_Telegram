// Path
import express from "express";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";

// Dotenv Config
dotenv.config();

// Port 
const PORT = process.env.PORT || 3535;

// App
const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to do Bot");
});

// Imports 
import { connect } from "./database/db.js";
import { sendStartMessage } from "./utils/messages/start-message.js"
import { sendHelpMessage } from "./utils/messages/help-message.js";
import { paymentMessage, needTestMessage } from "./utils/messages/chat-messages.js";
import { createUserAccount, getUserData, updateUserData, showUserChatID, changeUserRole, banUser, unbanUser, checkAutoBan } from "./controller/user.controller.js";
import { getQuestions } from "./controller/question.controller.js";
import { getRandomTopic } from "./controller/topic-phrasal.controller.js";
import { sendNextQuestion } from "./utils/question/question-helper.js";
import { chatMessage } from "./utils/messages/topic-message.js";

// Intialize Bot 
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

let userSessions = {};
let userQueue = [];
let userPairs = {};

bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Show help information' },
    { command: 'chat', description: 'Find a chat partner' },
    { command: 'end', description: 'End the current chat' },
    { command: 'test', description: 'Take an English test' },
    { command: 'myid', description: 'Show your Chat ID' }
]);

bot.start(async (ctx) => {
    try {
        await sendStartMessage(ctx);
        await createUserAccount(ctx);
    } catch (error) {
        console.log(error);
    }
});

bot.command('help', async (ctx) => {
    try {
        await sendHelpMessage(ctx);
    } catch (error) {
        console.log(error);
    };
});

bot.command('changeRole', async (ctx) => {
    try {
        await changeUserRole(ctx);
    } catch (error) {
        console.log(error);
    };
});

bot.command('myid', async (ctx) => {
    try {
        await showUserChatID(ctx);
    } catch (error) {
        console.log(error);
    };
});

bot.command('ban', async (ctx) => {
    try {
        await banUser(ctx);
    } catch (error) {
        console.log(error);
    };
});

bot.command('unban', async (ctx) => {
    try {
        await unbanUser(ctx);
    } catch (error) {
        console.log(error);
    };
});

bot.command('test', async (ctx) => {
    try {
        const userID = ctx.from.id;
        const questions = await getQuestions(ctx);

        if (questions.length < 25) {
            return ctx.replyWithHTML('<b>There is no enough question in the database! Please try again later</b>');
        };

        userSessions[userID] = {
            questions,
            currentQuestionIndex: 0,
            correctAnswers: 0,
            wrongAnswers: 0
        };

        sendNextQuestion(ctx, userID, userSessions);
    } catch (error) {
        console.log(error);
    };
});

bot.command('chat', async (ctx) => {
    try {
        await updateUserData(ctx);

        const user = await getUserData(ctx);

        if (!user) {
            return ctx.replyWithHTML('<p>There is no valid account</p>');
        };

        if (user.banned === true) {
            return paymentMessage(ctx);
        } else if (user.english_level === "unknown") {
            return needTestMessage(ctx);
        };

        userQueue.push({
            userID: ctx.from.id,
            username: user.username !== "unknown" ? user.username : "Telegram user",
            english_level: user.english_level
        });

        const compatibleLevels = {
            'A1': ['A1', 'A2'],
            'A2': ['A1', 'A2', 'B1'],
            'B1': ['A2', 'B1', 'B2'],
            'B2': ['B1', 'B2', 'C1'],
            'C1': ['B2', 'C1', 'C2'],
            'C2': ['C1', 'C2']
        };

        const matchIndex = userQueue.findIndex(waitingUser => {
            return compatibleLevels[user.english_level].includes(waitingUser.english_level) && ctx.from.id !== waitingUser.userID;
        });

        if (matchIndex !== -1) {
            const matchedUser = userQueue.splice(matchIndex, 1)[0];

            userPairs[ctx.from.id] = matchedUser.userID;
            userPairs[matchedUser.userID] = ctx.from.id;

            ctx.telegram.sendMessage(ctx.from.id, `You are connected with ${matchedUser.username === "Telegram user" ? "a Telegram user" : `@${matchedUser.username}`}`);
            ctx.telegram.sendMessage(matchedUser.userID, `You are connected with ${user.username === "unknown" ? "a Telegram user" : `@${user.username}`}`);
            await getRandomTopic(ctx, ctx.from.id, matchedUser.userID);

        } else {
            ctx.replyWithHTML('No compatible users found. You will be notified when a match is found.');
        };

    } catch (error) {
        console.log(error);
    };
})

bot.command('end', async (ctx) => {
    try {
        const userID = ctx.from.id;

        const matchedUserID = userPairs[userID];
        if (matchedUserID) {
            await ctx.telegram.sendMessage(userID, 'You have ended the chat.');
            await ctx.telegram.sendMessage(matchedUserID, 'Your chat partner has ended the chat.');

            delete userPairs[userID];
            delete userPairs[matchedUserID];
            userQueue = userQueue.filter(waitingUser => waitingUser.userID !== userID);
            userQueue = userQueue.filter(waitingUser => waitingUser.userID !== matchedUserID);

        } else {
            const userIndex = userQueue.findIndex(waitingUser => waitingUser.userID === userID);
            if (userIndex !== -1) {
                userQueue.splice(userIndex, 1);
                ctx.replyWithHTML('You have been removed from the queue.');
            } else {
                ctx.replyWithHTML('You are not in the queue or an active chat.');
            };
        };
    } catch (error) {
        console.log(error);
        ctx.replyWithHTML('An error occurred while processing your request. Please try again.');
    };
});

bot.on('callback_query', async (ctx) => {
    try {
        const userID = ctx.from.id;
        const session = userSessions[userID];

        if (!session) {
            return ctx.reply('Please start the test first by typing /test.');
        };

        const data = ctx.callbackQuery?.data;

        if (!data) {
            return ctx.reply('Data not found.');
        }

        const parsedData = JSON.parse(data);
        const userAsnwer = parsedData.answer;

        const currentQuestion = session.questions[session.currentQuestionIndex];
        const correctAnswer = currentQuestion.correct_answer;

        if (userAsnwer === correctAnswer) {
            session.correctAnswers++;
        } else {
            session.wrongAnswers++;
        };

        session.currentQuestionIndex++;

        await sendNextQuestion(ctx, userID, userSessions);
    } catch (error) {
        console.log(error);
    };
});

bot.on('message', async (ctx) => {
    try {
        const user = await getUserData(ctx);

        if (user.banned === true) {
            return paymentMessage(ctx);
        } else if (user.english_level === "unknown") {
            return needTestMessage(ctx);
        };

        const matchedUserID = userPairs[ctx.from.id];

        if (matchedUserID) {
            await ctx.telegram.sendMessage(matchedUserID, ctx.message.text);
        } else {
            await ctx.reply("Wrong command. You are not matched with anyone currently. Use /chat to find a match.");
        }
    } catch (error) {
        console.log(error);
    };
});

// Check Auto Ban every 1 hour
setInterval(checkAutoBan, 1 * 60 * 60 * 1000);

// App Listen
app.listen(PORT, () => {
    connect();
    console.log(`Server working on ${PORT} port`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));