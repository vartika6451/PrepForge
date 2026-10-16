import { pool } from "./index";
import { PATTERNS } from "@/data/patterns";
import { DSA_QUESTIONS } from "@/data/questions";
import { INTERVIEW_QUESTIONS } from "@/data/interview-questions";
import { CORE_CS_QUESTIONS } from "@/data/core-cs";

export async function seedQuestions() {
  console.log("Seeding canonical questions into PostgreSQL questions table...");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Seed DSA Questions
    for (const q of DSA_QUESTIONS) {
      const patternName =
        PATTERNS.find(p => q.patternSlugs.includes(p.slug))?.name || "General DSA";

      await client.query(
        `INSERT INTO questions (
          id, type, category, pattern_or_topic, title, difficulty, platform, external_url, explanation, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          pattern_or_topic = EXCLUDED.pattern_or_topic,
          difficulty = EXCLUDED.difficulty,
          external_url = EXCLUDED.external_url,
          explanation = EXCLUDED.explanation`,
        [
          q.id,
          "dsa",
          patternName,
          q.patternSlugs.join(", "),
          q.title,
          q.difficulty,
          q.platform,
          q.externalUrl,
          q.editorialNote,
          q.patternSlugs
        ]
      );
    }

    // 2. Seed Interview Questions
    for (const iq of INTERVIEW_QUESTIONS) {
      await client.query(
        `INSERT INTO questions (
          id, type, category, pattern_or_topic, title, difficulty, platform, external_url, explanation, code_example, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          pattern_or_topic = EXCLUDED.pattern_or_topic,
          difficulty = EXCLUDED.difficulty,
          explanation = EXCLUDED.explanation,
          code_example = EXCLUDED.code_example`,
        [
          iq.id,
          "development",
          iq.technologySlug,
          iq.topic,
          iq.title,
          iq.difficulty,
          "PrepForge Curated",
          null,
          iq.explanation,
          iq.codeExample || null,
          iq.keyTakeaways
        ]
      );
    }

    // 3. Seed Core CS & SQL Questions
    for (const cs of CORE_CS_QUESTIONS) {
      await client.query(
        `INSERT INTO questions (
          id, type, category, pattern_or_topic, title, difficulty, platform, external_url, explanation, code_example, sample_schema, solution_query, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          pattern_or_topic = EXCLUDED.pattern_or_topic,
          difficulty = EXCLUDED.difficulty,
          explanation = EXCLUDED.explanation,
          code_example = EXCLUDED.code_example,
          sample_schema = EXCLUDED.sample_schema,
          solution_query = EXCLUDED.solution_query`,
        [
          cs.id,
          cs.subject === "SQL" ? "sql" : "core_cs",
          cs.subject,
          cs.topic,
          cs.title,
          cs.difficulty,
          "PrepForge Curated",
          null,
          cs.explanation,
          cs.codeExample || null,
          cs.sampleSchema || null,
          cs.solutionQuery || null,
          cs.keyTakeaways
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Successfully seeded questions table!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error seeding questions:", err);
    throw err;
  } finally {
    client.release();
  }
}

// Allow direct CLI execution via ts-node / node
if (require.main === module) {
  seedQuestions().then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  });
}
