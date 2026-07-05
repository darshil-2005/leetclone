CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author_id" integer NOT NULL,
	"description" text NOT NULL,
	"default_code" text NOT NULL,
	"examples" jsonb NOT NULL,
	"run_testcases" jsonb NOT NULL,
	"constraints" text NOT NULL,
	"difficulty" text NOT NULL,
	"timelimit" integer NOT NULL,
	"memorylimit" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"submissionId" text PRIMARY KEY NOT NULL,
	"userId" integer,
	"problemId" integer,
	"language" text NOT NULL,
	"code" text NOT NULL,
	"status" text NOT NULL,
	"result" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submit_testcases" (
	"id" serial PRIMARY KEY NOT NULL,
	"problem_id" integer NOT NULL,
	"input" text NOT NULL,
	"expected_output" text NOT NULL
);
