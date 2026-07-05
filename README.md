# JudgeCode - Full-Stack Online Judge Engine

JudgeCode is an educational project built to understand how online judge platforms (like LeetCode) work under the hood. It demonstrates how to evaluate user-submitted algorithms in **JavaScript**, **Python**, and **C++** using a Remote Code Execution (RCE) environment.

## 🚀 Key Features

* **Multi-Language Support**: Seamlessly compile and execute JavaScript, Python, and C++ code.
* **Secure RCE Sandbox**: Code is executed inside an ephemeral, network-isolated Docker container.
* **Strict Execution Limits**: Actively prevents abuse by enforcing Time Limit Exceeded (TLE), Memory Limit Exceeded (MLE), Output Limit Exceeded (OLE), and Fork Bombs.
* **Asynchronous Architecture**: Employs a Redis-backed BullMQ job queue to decouple the web server from the heavy execution engine.
* **Modern Tech Stack**: Built with Next.js (React), PostgreSQL, Redis, Docker, and Drizzle ORM.

## 🏗️ System Architecture

*For a detailed deep dive into how the distributed execution engine, job queues, and Docker sandboxes work, please read [architecture.md](./architecture.md).*

---

## 🛠️ Getting Started

Follow these instructions to run the entire stack locally.

### Prerequisites
* **Node.js** (v18+)
* **Docker** & **Docker Compose** (Required for the RCE sandbox, Postgres, and Redis)

### 1. Installation

Clone the repository and install the dependencies for all workspaces:

```bash
git clone https://github.com/your-username/judgecode.git
cd judgecode
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory (and copy it to `frontend/.env.local` for Next.js to pick it up):

```env
JWT_SECRET='your_super_secret_jwt_key'
BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=postgres://postgres:postgres@localhost:5433/leetclone
```

### 3. Build the Docker Runner Image

The `codejudge` worker spins up ephemeral containers using a specific base image. You must build this image locally first:

```bash
npm run docker:build -w codejudge
```
*(This builds the `judgecode-runner` image containing Node, Python, and GCC).*

### 4. Start Infrastructure Services

Spin up the local PostgreSQL database and Redis queue using Docker Compose:

```bash
npm run services:up
```

### 5. Setup the Database

Push the Drizzle ORM schema to Postgres and seed it with initial problems (like *Two Sum*):

```bash
npm run db:push
npm run db:seed
```

### 6. Run the Application

Start both the Next.js frontend server and the Codejudge background worker simultaneously using our consolidated script:

```bash
npm run dev:all
```

**That's it!** 🎉
Open [http://localhost:3000](http://localhost:3000) in your browser. You can register an account, navigate to a problem, and start executing code!

---

## 🛑 Shutting Down

When you are done developing, you can cleanly stop the background services (Postgres and Redis):

```bash
npm run services:down
```

## 🛡️ Disclaimer

**This is an educational project built for learning purposes only.** It is not intended for use in a production environment. While it implements basic Docker-level limits (`--memory`, `--pids-limit`, `--network none`) to demonstrate sandboxing concepts, real-world production systems require much stronger hypervisor-based sandboxing (like gVisor or Firecracker) for absolute multi-tenant security.
