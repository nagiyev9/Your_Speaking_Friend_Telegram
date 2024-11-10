import { supabase } from "../database/db.js";

// Get Questions --> 25 Random Questions
const getQuestions = async () => {
    const { data, error } = await supabase
        .from('questions')
        .select('*');
        
    if (error) {
        console.log('Error fetching questions:', error);
        return null;
    }

    const shuffledData = data.sort(() => 0.5 - Math.random()).slice(0, 25);

    return shuffledData;
};

export default { getQuestions };