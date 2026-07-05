const { pgTable, serial, integer, text, jsonb } = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authorId: integer('author_id').notNull(),
  description: text("description").notNull(),
  defaultCode: text("default_code").notNull(),
  examples: jsonb("examples").notNull(),
  run_testcases: jsonb("run_testcases").notNull(),
  constraints: text("constraints").notNull(),
  difficulty: text("difficulty").notNull(),
  timelimit: integer("timelimit").notNull(),      // in ms
  memorylimit: integer("memorylimit").notNull(),  // in MB
});

const submissions = pgTable("submissions", {
  submissionId: text("submissionId").primaryKey(),
  userId: integer("userId"),
  problemId: integer("problemId"),
  language: text("language").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(),
  result: text("result").notNull(),
});

const submit_testcases = pgTable("submit_testcases", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id").notNull(),
  input: text("input").notNull(),
  expectedOutput: text("expected_output").notNull(),
});

const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions),
  problems: many(problems),
}));

const problemsRelations = relations(problems, ({ many, one }) => ({
  submissions: many(submissions),
  author: one(users, {
    fields: [problems.authorId],
    references: [users.id],
  }),
  submit_testcases: many(submit_testcases, {
    fields: [problems.id],
    references: [submit_testcases.problemId],
  }),
}));

const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
}));

const submitTestcasesRelations = relations(submit_testcases, ({ one }) => ({
  problem: one(problems, {
    fields: [submit_testcases.problemId],
    references: [problems.id],
  }),
}));

module.exports = {
  users,
  problems,
  submissions,
  submit_testcases,
  usersRelations,
  problemsRelations,
  submissionsRelations,
  submitTestcasesRelations,
};
