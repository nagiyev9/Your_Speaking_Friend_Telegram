import userService from "../../service/user.service.js";

export const sendHelpMessage = async (ctx) => {
    const helperCommand = `<b>-- COMMAND LIST</b>\n
<b>/start</b> - <i>Start bot</i>\n
<b>/chat</b> - <i>Start new chat</i>\n
<b>/end</b> - <i>End chat or queue</i>\n
<b>/test</b> - <i>Start an English test</i>\n
<b>/myid</b> - <i>Your chat id</i>\n
<b>/help</b> - <i>Command list</i>`;

    const adminHelperCommand = `<b>-- COMMAND LIST</b>\n
<b>/start</b> - <i>Start bot</i>\n
<b>/chat</b> - <i>Start new chat</i>\n
<b>/end</b> - <i>End chat or queue</i>\n
<b>/test</b> - <i>Start an English test</i>\n
<b>/myid</b> - <i>Your chat id</i>\n
<b>/help</b> - <i>Command list</i>\n

<b>-- Admin Command List </b>\n
<b>/ban userID</b> - <i>Ban user</i>\n
<b>/unban userID</b> - <i>Unban user</i>\n
<b>/changeRole userID</b> - <i>Change user role</i>`;

    try {
        const userID = ctx.from.id.toString();
        const isAdmin = await userService.getUserByUserID(userID);

        if (isAdmin.role !== "admin") {
            return await ctx.replyWithHTML(helperCommand);
        };

        await ctx.replyWithHTML(adminHelperCommand);

    } catch (error) {
        console.error('Error sending message:', error);
    }
};
