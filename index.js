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
import { createUserAccount, getUserData, showUserChatID, changeUserRole, banUser, unbanUser, checkAutoBan } from "./controller/user.controller.js";
import { getQuestions } from "./controller/question.controller.js";
import { getRandomTopic } from "./controller/topic-phrasal.controller.js";
import { sendNextQuestion } from "./utils/question/question-helper.js";
import { chatMessage } from "./utils/messages/topic-message.js";

// Intialize Bot 
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

let userSessions = {};
let userQueue = [];
let userPairs = {};

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

bot.command('myID', async (ctx) => {
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
        const user = await getUserData(ctx);

        if (user.banned === true) {
            return paymentMessage(ctx);
        } else if (user.english_level === "unknown") {
            return needTestMessage(ctx);
        }

        userQueue.push({
            userID: ctx.from.id,
            username: user.username !== null ? user.username : "Telegram user",
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

        console.log(matchIndex !== -1);

        if (matchIndex !== -1) {
            const matchedUser = userQueue.splice(matchIndex, 1)[0];
            userPairs[ctx.from.id] = matchedUser.userID;
            userPairs[matchedUser.userID] = ctx.from.id;

            try {
                ctx.telegram.sendMessage(ctx.from.id, `You are connected with ${matchedUser.username}`);
                ctx.telegram.sendMessage(matchedUser.userID, `You are connected with ${user.username}`);
                // Random topic will be sent now
                await getRandomTopic(ctx, ctx.from.id, matchedUser.userID);  // Now this will run when a match is found
            } catch (error) {
                console.log(error);
                ctx.telegram.sendMessage(ctx.from.id, 'An error occurred while fetching. Please try again later.');
                ctx.telegram.sendMessage(matchedUser.userID, 'An error occurred while fetching. Please try again later.');
            }
        } else {
            ctx.replyWithHTML('No compatible users found. You will be notified when a match is found.');
        }
    } catch (error) {
        console.log(error);
    }
});


bot.command('end', async (ctx) => {
    try {
        const user = await getUserData(ctx);

        const userIndex = userQueue.findIndex(waitingUser => waitingUser.userID === user.userID);
        console.log(userQueue);

        if (userIndex !== -1) {
            userQueue.splice(userIndex, 1);
            ctx.replyWithHTML('You have been removed from the queue.');
        } else {
            ctx.replyWithHTML('You are not in the queue.');
            console.log(userQueue);
        }
    } catch (error) {
        console.log(error);
        ctx.replyWithHTML('An error occurred while processing your request. Please try again.');
    }
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
        }

        else if (user.english_level === "unknown") {
            return needTestMessage(ctx);
        }

        const isInQueue = userQueue.some(queueUser => queueUser.userID === user.userID);
        if (!isInQueue) {
            userQueue.push({
                userID: user.userID,
                username: user.username !== null ? user.username : "Telegram user",
                english_level: user.english_level
            });

            ctx.replyWithHTML("You have been added to the queue. Please wait while we find a match.");
        } else {
            ctx.replyWithHTML("You are already in the queue. Please wait while we find a match.");
        }
    } catch (error) {
        console.log(error);
        ctx.replyWithHTML("An error occurred while processing your request. Please try again.");
    }
});

setInterval(checkAutoBan, 1 * 60 * 60 * 1000);

// App Listen
app.listen(PORT, () => {
    connect();
    console.log(`Server working on ${PORT} port`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));