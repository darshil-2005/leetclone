## user
    name
    username
    password

## problems
    id
    title
    description
    examples
    constraints
    difficulty

## submissions
    id
    userid
    problemid
    code
    status
    Reason
    createdAt
 # Database Notes

 The shared database package lives in `backend` and exports the Drizzle instance plus the tables used by the frontend API routes and runner.

 ## Core tables

 - `users`
 - `problems`
 - `submissions`
 - `submit_testcases`

 ## Current data flow

 - The frontend writes problems, auth state, and submission rows through `@judgecode/backend`.
 - `POST /api/check_code` reads `submit_testcases` for submit mode.
 - The runner posts the final submission status back to `POST /api/log_submission`.

 ## Package commands

 - `npm run db:generate -w backend`
 - `npm run db:push -w backend`

 Keep the schema definitions in `backend/src/schema.js` and the queue export in `backend/src/submission_queue/queue.js` aligned with any route or runner changes.