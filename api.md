## Auth
##    login
##    register
##    get me

## Run Tests
## Submit Code
## Get All Question
## Get one Question by id
## Submit Questions
##    HANDLE QUESTION SUBMISSION AND TESTCASE SUBMISSION 
 # API Notes

 The current API lives in `frontend/src/app/api`.

 ## Auth

 - `POST /api/login`
 - `POST /api/register`
 - `POST /api/logout`
 - `GET /api/me`

 ## Problems

 - `POST /api/create_problem`
 - `GET /api/problem/[id]`

 ## Submissions

 - `POST /api/check_code` enqueues a run or submit job
 - `POST /api/log_submission` persists the worker result
 - `GET /api/submission/[submissionId]` fetches a stored submission

 `check_code` sends jobs to the shared BullMQ queue exported by `@judgecode/backend`. The runner consumes those jobs and posts the final status back through `log_submission`.