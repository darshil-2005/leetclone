const { integer, text, json } = require("drizzle-orm/gel-core");
const { sqliteTable } = require("drizzle-orm/sqlite-core");
const { relations } = require("drizzle-orm");

const difficulty = ["Easy", "Medium", "Hard", "Don't Bother"];
const status = ["Accepted", "Rejected"];

const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
//   createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

const problems = sqliteTable("problems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  authorId: integer('author_id').notNull(),
  description: text("description").notNull(),
  examples: json("examples").notNull(),
  constraints: text("constraints").notNull(),
  difficulty: text("difficulty", { enums: difficulty }).notNull(),
//   createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

const submissions = sqliteTable("submissions", {
  id: integer("id", { autoIncrement: true }).primaryKey(),
  userId: integer("userId"),
  problemId: integer("problemId"),
  code: text("code").notNull(),
  status: text("status", { enums: status }).notNull(),
  reason: text("reason"),
//   createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
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

module.exports = {
  users,
  problems,
  submissions,
  usersRelations,
  problemsRelations,
  submissionsRelations,
};
