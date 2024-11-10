import { supabase } from "../database/db.js";

// Get Topic --> Random Topic
const getTopic = async () => {
    const { data, error } = await supabase
        .from('topics')
        .select('*')

    if (error) {
        console.log('Error fetching topics:', error);
        return null;
    }

    const shuffledData = data.sort(() => 0.5 - Math.random()).slice(0, 1);
    return shuffledData;
};

// Get Random 5 Phrasal Verbs
const getPhrasalVerbs = async () => {
    const { data, error } = await supabase
        .from('phrasals')
        .select('*')

    if (error) {
        console.log('Error fetching phrasals:', error);
        return null;
    }

    const shuffledData = data.sort(() => 0.5 - Math.random()).slice(0, 5);
    return shuffledData;

};

export default { getTopic, getPhrasalVerbs };