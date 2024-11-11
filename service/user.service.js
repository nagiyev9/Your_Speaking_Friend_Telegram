import { supabase } from "../database/db.js";

// Get All Users
const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    return error ? null : data;
};

// Get User By User ID
const getUserByUserID = async (userID) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userID', userID)
        .single();

    return error ? null : data;
};

// Create Account From User ID
const createUserAccount = async (userID, username, first_name, last_name) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ userID, username, first_name, last_name }]);

    return error ? null : data;
};

// Update User Data
const updateUserData = async (userID, username, first_name, last_name) => {
    const { data, error } = await supabase
        .from('users')
        .update({ username, first_name, last_name })
        .eq('userID', userID);

    return error ? null : data;
}

// Change User Role
const changeUserRole = async (userID, role) => {
    const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('userID', userID);

    return error ? null : data;
};

// Ban User
const banUser = async (userID) => {
    const { data, error } = await supabase
        .from('users')
        .update({ banned: true })
        .eq('userID', userID);

    return error ? null : data;
};

// Unban User
const unbanUser = async (userID) => {
    const { data, error } = await supabase
        .from('users')
        .update({ banned: false, last_unban_date: new Date().toISOString() })
        .eq('userID', userID);

    return error ? null : data;
};

// Update User English Level
const updateUserEnglishLevel = async (userID, englishLevel) => {
    const { data, error } = await supabase
        .from('users')
        .update({ english_level: englishLevel })
        .eq('userID', userID);

    return error ? null : data;
};

export default { getAllUsers, getUserByUserID, createUserAccount, updateUserData, changeUserRole, banUser, unbanUser, updateUserEnglishLevel };