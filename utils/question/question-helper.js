import { shuffleArray } from "./shuffle-array.js";
import { updateUserEnglishLevel } from "../../controller/user.controller.js";

export const sendNextQuestion = async (ctx, userID, userSessions) => {
    try {
        const session = userSessions[userID];

        if (session.currentQuestionIndex < session.questions.length) {
            const question = session.questions[session.currentQuestionIndex];

            const options = [
                question.correct_answer,
                question.wrong_answer_1,
                question.wrong_answer_2,
                question.wrong_answer_3
            ];

            shuffleArray(options);

            const inlineKeyboard = options.map((option) => ([{
                text: option,
                callback_data: JSON.stringify({ answer: option })
            }]));

            await ctx.replyWithHTML(`<b>${question.question}</b>`, {
                reply_markup: {
                    inline_keyboard: inlineKeyboard
                }
            });
        } else { 
            const correctAnswer = session.correctAnswers;
            const wrongAnswer = session.wrongAnswers;

            const newEnglishLevel = calculateEnglishLevel(correctAnswer, session.questions.length);
            await updateUserEnglishLevel(ctx, newEnglishLevel);

            await ctx.replyWithHTML(`<b>Test completed!</b>\nCorrect Answers: ${correctAnswer}\nWrong Answers: ${wrongAnswer}\n<b>Your English Level: ${newEnglishLevel}</b>`);

            delete userSessions[userID];
        };
    } catch (error) {
        console.log(error);  
    };
};

// Calculate English Level
const calculateEnglishLevel = (score, totalQuestions) => {
    let englishLevel;
    if (score < totalQuestions * 0.2) {
        englishLevel = 'A1';
    } else if (score < totalQuestions * 0.4) {
        englishLevel = 'A2';
    } else if (score < totalQuestions * 0.6) {
        englishLevel = 'B1';
    } else if (score < totalQuestions * 0.8) {
        englishLevel = 'B2';
    } else if (score < totalQuestions * 0.9) {
        englishLevel = 'C1';
    } else {
        englishLevel = 'C2';
    }
    return englishLevel;
};