import { PrismaClient } from "@prisma/client";
import { PATTERNS } from "../src/data/patterns";
import { DSA_QUESTIONS } from "../src/data/questions";
import { TECHNOLOGIES } from "../src/data/technologies";
import { FREE_RESOURCES, PAID_COURSES } from "../src/data/resources";
import { INTERVIEW_QUESTIONS } from "../src/data/interview-questions";
import { PROJECTS } from "../src/data/projects";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting PrepForge database seed...");

  // Seed Technologies
  for (const tech of TECHNOLOGIES) {
    await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: {
        name: tech.name,
        description: tech.description,
        category: tech.category,
        sortOrder: tech.sortOrder,
        iconName: tech.iconName,
        colorClass: tech.colorClass,
        tagline: tech.tagline
      },
      create: {
        id: tech.id,
        slug: tech.slug,
        name: tech.name,
        description: tech.description,
        category: tech.category,
        sortOrder: tech.sortOrder,
        iconName: tech.iconName,
        colorClass: tech.colorClass,
        tagline: tech.tagline
      }
    });
  }
  console.log(`✓ Seeded ${TECHNOLOGIES.length} technologies`);

  // Seed Patterns
  for (const pat of PATTERNS) {
    await prisma.pattern.upsert({
      where: { slug: pat.slug },
      update: {
        name: pat.name,
        description: pat.description,
        category: pat.category,
        recognitionHints: pat.recognitionHints,
        commonApproaches: pat.commonApproaches,
        commonMistakes: pat.commonMistakes,
        difficultyLevel: pat.difficultyLevel,
        sortOrder: pat.sortOrder,
        tags: pat.tags
      },
      create: {
        id: pat.id,
        slug: pat.slug,
        name: pat.name,
        description: pat.description,
        category: pat.category,
        recognitionHints: pat.recognitionHints,
        commonApproaches: pat.commonApproaches,
        commonMistakes: pat.commonMistakes,
        difficultyLevel: pat.difficultyLevel,
        sortOrder: pat.sortOrder,
        tags: pat.tags
      }
    });
  }
  console.log(`✓ Seeded ${PATTERNS.length} DSA patterns`);

  console.log("PrepForge seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
