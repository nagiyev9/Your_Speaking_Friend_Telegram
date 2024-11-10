import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const connect = async () => {
    try {
        const { data, error } = await supabase
            .from('test_table')
            .select('*');

        if (error) {
            throw error;
        }

        console.log('Successfully connected to Supabase');
    } catch (error) {
        logger.error('Error connecting to Supabase:', error.message);
    }
};


export { supabase, connect };