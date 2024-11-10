import userService from "../service/user.service.js";

// Create Account From User ID
export const createUserAccount = async ctx => {
    try {
        const user = ctx.from;

        if (!user) {
            return ctx.replyWithHTML('<p>There is no valid account</p>');
        };

        const checkAccount = await userService.getUserByUserID(user.id.toString());

        if (checkAccount) {
            return;
        };

        await userService.createUserAccount(user.id, user.username || "unknown", user.first_name || "unknown", user.last_name || "unknown");
    } catch (error) {
        console.log(error);
    };
};

// Get User Data
export const getUserData = async ctx => {
    try {
        const userID = ctx.from.id.toString();
        const user = await userService.getUserByUserID(userID);

        if (!userID || !user) {
            ctx.replyWithHTML('<p>There is no valid account</p>');
        };

        return user;
    } catch (error) {
        console.log(error);  
    };
}

// Get User By User ID
export const showUserChatID = async ctx => {
    try {
        const user = ctx.from;
        const message = ctx.message.text.split(' ');

        if (message.length !== 1) {
            return ctx.replyWithHTML("<b>Wrong command!</b>");
        };

        if (!user) {
            return ctx.replyWithHTML('<p>There is no valid account</p>');
        };

        const checkAccount = await userService.getUserByUserID(user.id.toString());

        if (!checkAccount) {
            return ctx.replyWithHTML("<b>There is no account!</b>");
        };

        ctx.replyWithHTML(`<b>Your telegram chat id: ${checkAccount.userID}</b>`);
    } catch (error) {
        console.log(error);
    };
};

// Change User Role
export const changeUserRole = async ctx => {
    try {
        const admin = ctx.from;
        const user = ctx.message.text.split(' ');

        if (user.length !== 2) {
            return ctx.replyWithHTML("<b>Wrong command!</b>");
        };

        const userID = user[1];

        const checkAdmin = await userService.getUserByUserID(admin.id.toString());

        if (checkAdmin.role === "user") {
            return ctx.replyWithHTML("<b>You don't have permissions to use this function!</b>");
        };

        if (!userID) {
            return ctx.replyWithHTML("<b>Please write valid ID!</b>");
        };

        const checkUser = await userService.getUserByUserID(userID.toString());

        if (!checkUser) {
            return ctx.replyWithHTML("<b>User not found!</b>");
        };

        await userService.changeUserRole(userID, checkUser.role === "user" ? "admin" : "user");
        return ctx.replyWithHTML("<b>User's role changed</b>");
    } catch (error) {
        console.log(error);
    };
};

// Ban User
export const banUser = async ctx => {
    try {
        const admin = ctx.from;
        const user = ctx.message.text.split(' ');

        if (user.length !== 2) {
            return ctx.replyWithHTML("<b>Wrong command!</b>");
        };


        const checkAdmin = await userService.getUserByUserID(admin.id.toString());

        if (checkAdmin.role === "user") {
            return ctx.replyWithHTML("<b>You don't have permissions to use this function!</b>");
        };

        const userID = user[1];

        if (!userID) {
            return ctx.replyWithHTML("<b>Please write valid ID!</b>");
        };

        const checkUser = await userService.getUserByUserID(userID.toString());

        if (!checkUser) {
            return ctx.replyWithHTML('<b>User not found!</b>');
        };

        if (checkUser.banned === true) {
            return ctx.replyWithHTML('<b>This user already banned!</b>');
        };

        await userService.banUser(userID.toString());
        ctx.replyWithHTML("<b>User banned</b>");
    } catch (error) {
        console.log(error);
    };
};

// Unban User
export const unbanUser = async ctx => {
    try {
        const admin = ctx.from;
        const user = ctx.message.text.split(' ');

        if (user.length !== 2) {
            return ctx.replyWithHTML("<b>Wrong command!</b>");
        };

        const checkAdmin = await userService.getUserByUserID(admin.id.toString());

        if (checkAdmin.role === "user") {
            return ctx.replyWithHTML("<b>You don't have permissions to use this function!</b>");
        };

        const userID = user[1];

        if (!userID) {
            return ctx.replyWithHTML("<b>Please write valid ID!</b>");
        };

        const checkUser = await userService.getUserByUserID(userID.toString());

        if (!checkUser) {
            return ctx.replyWithHTML('<b>User not found!</b>');
        };

        if (checkUser.banned === false) {
            return ctx.replyWithHTML('<b>This user already unbanned!</b>');
        };

        await userService.unbanUser(userID.toString());
        ctx.replyWithHTML("<b>User unbanned</b>");
    } catch (error) {
        console.log(error);
    };
};

// Update User English Level
export const updateUserEnglishLevel = async (ctx, level) => {
    try {
        const userID = ctx.from.id.toString();

        const checkUser = await userService.getUserByUserID(userID);

        if (!checkUser || !userID) {
            return ctx.replyWithHTML(!checkUser ? "<b>There is no vaild account!</b>" : "User not found!");
        };

        await userService.updateUserEnglishLevel(userID, level);
    } catch (error) {
        console.log(error);
    };
};

// Check Auto Ban
export const checkAutoBan = async () => {
    try {
        const users = await userService.getAllUsers();

        users.map(async (user) => {
            const oneMonth = 1000 * 60 * 60 * 24 * 30;
            const timeSinceBan = Date.now() - new Date(user.last_unban_date).getTime();

            if (timeSinceBan > oneMonth && user.banned === false) {
                const userID = user.userID.toString();

                await userService.banUser(userID);
                user.save();
            };
        });
    } catch (error) {
        console.log(error);  
    };
};