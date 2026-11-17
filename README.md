
# Propomy Frontend

## Environment Files

This project uses three environment files for different stages:

- `.env.dev` — Development
- `.env.qa` — QA
- `.env.prod` — Production

These files are ignored by git (see `.gitignore`).

### How to use
1. Create `.env.dev`, `.env.qa`, and `.env.prod` in the project root.
2. Add your variables, for example:
   ```env
   REACT_APP_API_URL=https://api.example.com
   REACT_APP_SECRET_KEY=your_secret_key
   ```
3. To run with a specific environment, copy the file to `.env` before starting:
   ```sh
   cp .env.dev .env && npm run dev   # Development
   cp .env.qa .env && npm run dev    # QA
   cp .env.prod .env && npm run build # Production
   ```

## Running the Project

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your environment file as above.
3. Start development:
   ```sh
   npm run dev
   ```
4. Build for production:
   ```sh
   npm run build
   ```
