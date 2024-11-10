export const chatMessage = async (ctx, userID, matchedUserID, randomTopic, randomPhrasalVerbs) => {
    const topicMessage = `
    <b>Topic: ${randomTopic.topic}</b>\n
<b>1. </b>${randomTopic.question_1}\n
<b>2. </b>${randomTopic.question_2}\n
<b>3. </b>${randomTopic.question_3}\n
<b>4. </b>${randomTopic.question_4}\n
<b>5. </b>${randomTopic.question_5}\n
<b>Phrasal Verbs</b>\n
${randomPhrasalVerbs.map((phrasal, index) => 
    `<b>${index + 1}. </b>${phrasal.verb} - ${phrasal.description}`
).join('\n\n')}`;

    try {
        await ctx.sendMessage(userID, topicMessage);
        await ctx.sendMessage(matchedUserID, topicMessage);
    } catch (error) {
        console.log(error);  
    };
};