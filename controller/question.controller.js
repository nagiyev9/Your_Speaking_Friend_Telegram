import questionService from "../service/question.service.js";

// Get Questions --> 25 Random Questions
export const getQuestions = async (ctx) => {
    try {
        const questions = await questionService.getQuestions();
        return questions;
    } catch (error) {
        console.log(error);
    };
};