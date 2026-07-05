# System Architecture

LeetClone is designed as a distributed, fault-tolerant system. Code execution is decoupled from the web server using asynchronous job queues and isolated Docker sandboxes to ensure high availability and security.

## 📦 Monorepo Workspaces

The project uses a monorepo architecture with npm workspaces:

1. **`frontend` (Next.js)**: The user-facing application. Handles React rendering, API endpoints, and user sessions via JWT.
2. **`backend` (Database Library)**: A shared library that encapsulates the PostgreSQL connection (`pg`), Drizzle ORM schema, and `BullMQ` queue instances. Both the frontend API and codejudge worker import from here to ensure the data layer stays perfectly in sync.
3. **`codejudge` (Execution Worker)**: A standalone Node.js background process. It consumes queue jobs, coordinates Docker sandbox creation, and streams results back to the database.

---

## 🔄 The Execution Lifecycle (API & Job Queue)

When a user submits code on the frontend, the following sequence occurs:

1. **Submission**: The user sends their raw code, selected language, and problem ID via a `POST` request to the `/api/check_code` endpoint.
2. **Queuing**: The Next.js API records the submission in PostgreSQL with a `pending` status. It then places a job on the Redis queue (`submission_queue`) using BullMQ.
3. **Processing**: The `codejudge` worker picks up the job from Redis.
4. **Sandboxing**: The worker calls the Docker Daemon to spin up an ephemeral container running the `judgecode-runner` image.
5. **Evaluating**: The container compiles (if necessary) and executes the code against hidden test cases.
6. **Logging**: Once execution finishes, the worker parses the output and updates the Postgres database (via the `/api/log_submission` endpoint) with the final status (`Accepted`, `Wrong Answer`, `Time Limit Exceeded`, etc.).

---

## 🛡️ Sandbox Security & Standard I/O

Executing untrusted code on a host machine is incredibly dangerous. LeetClone secures execution using **Docker-based isolation** combined with strict OS-level restrictions.

### **1. Standard I/O (No Shared Volumes or Env Vars)**
We do not mount directories between the host and the container, nor do we pass inputs via environment variables (which are susceptible to OS size limits and injection attacks). 
Instead, the entire payload (code + test cases) is piped into the container via **Standard Input (`stdin`)**. The container evaluates the code and returns a JSON result via **Standard Output (`stdout`)**. The Node.js worker on the host uses `execFileSync` to seamlessly bridge these streams.

### **2. Strict Resource Limits**
To prevent abuse, the container is heavily restricted:
- **Network Isolation**: (`--network none`) prevents the code from making HTTP requests to internal networks or the internet.
- **Time Limit Exceeded (TLE)**: The process is killed using Node's `timeout` signal if execution takes too long.
- **Memory Limit Exceeded (MLE)**: Docker enforces strict RAM usage (`--memory 256m`). If exceeded, the Linux Out-Of-Memory (OOM) killer kicks in and exits the process with `SIGKILL` (Code 137).
- **Fork Bomb Protection**: Docker restricts the container to a maximum of 128 processes (`--pids-limit 128`), stopping malicious `fork()` loops instantly.
- **Output Limit Exceeded (OLE)**: Output streams are capped at 64KB (`maxBuffer`) to prevent infinite loops from overflowing system logs.

---

## 🗄️ Data Layer

- **Engine**: PostgreSQL
- **ORM**: Drizzle ORM
- **Cache / Queues**: Redis

Using Drizzle ORM provides type-safe queries and explicit migration generation. The schema uses a highly normalized relational model to map Users -> Submissions -> Problems, with `jsonb` columns utilized where dynamic testcase storage is necessary.
