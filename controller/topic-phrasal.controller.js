import topicService from "../service/topic-phrasal.service.js";
import { chatMessage } from "../utils/messages/topic-message.js";

// Get Topic --> Random Topic
export const getRandomTopic = async (ctx, userID, matchedUserID) => {
    try {
        const randomTopic = await topicService.getTopic();
        const randomPhrasalVerbs = await topicService.getPhrasalVerbs();

        await chatMessage(ctx, userID, matchedUserID, randomTopic[0], randomPhrasalVerbs);
    } catch (error) {
        console.log(error);  
    };
};  