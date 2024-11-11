import topicService from "../service/topic-phrasal.service.js";
import { chatMessage } from "../utils/messages/topic-message.js";

export const getRandomTopic = async (ctx, userID, matchedUserID) => {
    try {
        const randomTopic = await topicService.getTopic();
        const randomPhrasalVerbs = await topicService.getPhrasalVerbs();

        if (!randomTopic || !randomPhrasalVerbs) {
            console.error("Failed to fetch topic or phrasal verbs.");
            return null;
        }

        return await chatMessage(ctx, userID, matchedUserID, randomTopic[0], randomPhrasalVerbs);
    } catch (error) {
        console.log(error);
    }
};
