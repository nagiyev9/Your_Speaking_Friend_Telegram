# OurSpeakingFriend - Telegram Bot

**OurSpeakingFriend** is a Telegram bot that helps users find conversation partners and improve their English skills. Once users are matched, the bot provides a topic, 5 questions, and 5 phrasal verbs for practice, allowing users to enhance their language abilities.

## Features

- Connects users with conversation partners.
- Provides topics with questions for discussion.
- Supplies phrasal verbs for English practice.
- Enhances English speaking and comprehension skills.

## Requirements

- Node.js (v16 or higher)
- A Telegram bot token
- Supabase account (for database integration)
- `.env` file containing:
  - `SUPABASE_URL` (Your Supabase project URL)
  - `SUPABASE_ANON_KEY` (Your Supabase anonymous key)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/nagiyev9/Your_Speaking_Friend_Telegram
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```bash
   TELEGRAM_TOKEN=your-telegram-token
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the bot:
   - For production:
     ```bash
     npm start
     ```
   - For development (with auto-restart):
     ```bash
     npm run dev
     ```

## Project Structure

- **index.js**: Main entry point for the bot.
- **Dependencies**:
  - `@supabase/supabase-js`: Supabase client for database operations.
  - `bcrypt`: For hashing and verifying passwords.
  - `dotenv`: Loads environment variables from a `.env` file.
  - `express`: Handles webhooks (optional).
  - `pg` & `pg-hstore`: PostgreSQL integration.
  - `telegraf`: Telegram bot framework.

## Usage

1. Register your bot with [BotFather](https://core.telegram.org/bots#botfather) on Telegram to get a token.
2. Set up a Supabase database and configure the necessary tables (e.g., users, topics, questions, phrasal verbs).
3. Run the bot using the start commands above.
4. Interact with the bot on Telegram and enjoy improving your English skills!

## License

This project is licensed under the MIT License.

Happy learning with **OurSpeakingFriend**! 😊
