export const paymentMessage = async (ctx) => {
    const message = `<b>Your account has been banned due to overdue payment.</b>\n
<b>Please contact this Instagram account</b>\n
<a href="https://www.instagram.com/your.speaking.friend/"><b>Your Speaking Friend</b></a>`;

    try {
        await ctx.replyWithHTML(message);
    } catch (error) {
        console.log(error);
    };
};

export const needTestMessage = async (ctx) => {
    const message = `<b>Your english level is unkonwn! Please write /test and take an english exam.</b>`
    
    try {
        await ctx.replyWithHTML(message);
    } catch (error) {
      console.log('Match Error', error);  
    };
};

export const successfullMatch = async (ctx, username) => {
    const message = `<b>You have been matched with ${username}! Start chatting!</b>`;

    try {
        await ctx.replyWithHTML(message);
    } catch (error) {
      console.log('Match Error', error);  
    };
};