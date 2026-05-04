import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

type PrismaWithDelegates = PrismaClient & {
  packagePlan: PrismaClient["packagePlan"];
  portfolio: PrismaClient["portfolio"];
  siteSettings: PrismaClient["siteSettings"];
  service: PrismaClient["service"];
  user: PrismaClient["user"];
};

type PrismaModelField = {
  name: string;
};

type PrismaRuntimeModel = {
  fields?: PrismaModelField[];
};

type PrismaRuntimeDataModel = {
  models?: Record<string, PrismaRuntimeModel>;
};

type PrismaClientWithRuntimeModel = PrismaClient & {
  _runtimeDataModel?: PrismaRuntimeDataModel;
};

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const adapter = new PrismaNeon({ connectionString });

function createPrismaClient() {
  return new PrismaClient({
    adapter,
  });
}

function hasExpectedDelegates(client: PrismaClient): client is PrismaWithDelegates {
  const candidate = client as Partial<PrismaWithDelegates>;

  return Boolean(
    candidate.packagePlan &&
      candidate.portfolio &&
      candidate.siteSettings &&
      candidate.service &&
      candidate.user,
  );
}

function isServiceModelInSync(client: PrismaClient) {
  const runtimeDataModel = (client as PrismaClientWithRuntimeModel)._runtimeDataModel;
  const serviceModel = runtimeDataModel?.models?.Service;
  const fieldNames = new Set(serviceModel?.fields?.map((field) => field.name) ?? []);

  if (fieldNames.size === 0) {
    return false;
  }

  return (
    fieldNames.has("id") &&
    fieldNames.has("title") &&
    fieldNames.has("description") &&
    fieldNames.has("thumbnailUrl") &&
    fieldNames.has("createdAt") &&
    fieldNames.has("updatedAt") &&
    fieldNames.has("serviceFeatures") &&
    !fieldNames.has("iconName") &&
    !fieldNames.has("sortOrder")
  );
}

function isPackagePlanModelInSync(client: PrismaClient) {
  const runtimeDataModel = (client as PrismaClientWithRuntimeModel)._runtimeDataModel;
  const packagePlanModel = runtimeDataModel?.models?.PackagePlan;
  const fieldNames = new Set(packagePlanModel?.fields?.map((field) => field.name) ?? []);

  if (fieldNames.size === 0) {
    return false;
  }

  return (
    fieldNames.has("id") &&
    fieldNames.has("slug") &&
    fieldNames.has("name") &&
    fieldNames.has("summary") &&
    fieldNames.has("priceLabel") &&
    fieldNames.has("priceAmount") &&
    fieldNames.has("renewalLabel") &&
    fieldNames.has("ctaLabel") &&
    fieldNames.has("ctaUrl") &&
    fieldNames.has("isFeatured") &&
    fieldNames.has("sortOrder") &&
    fieldNames.has("packageFeatures")
  );
}

function isPortfolioModelInSync(client: PrismaClient) {
  const runtimeDataModel = (client as PrismaClientWithRuntimeModel)._runtimeDataModel;
  const portfolioModel = runtimeDataModel?.models?.Portfolio;
  const fieldNames = new Set(portfolioModel?.fields?.map((field) => field.name) ?? []);

  if (fieldNames.size === 0) {
    return false;
  }

  return (
    fieldNames.has("id") &&
    fieldNames.has("slug") &&
    fieldNames.has("title") &&
    fieldNames.has("summary") &&
    fieldNames.has("contentHtml") &&
    fieldNames.has("thumbnailUrl") &&
    fieldNames.has("projectUrl") &&
    fieldNames.has("clientName") &&
    fieldNames.has("projectCategory") &&
    fieldNames.has("sortOrder") &&
    fieldNames.has("isFeatured") &&
    fieldNames.has("publishedAt")
  );
}

function getPrismaClient() {
  const cachedPrisma = globalForPrisma.prisma;

  if (
    cachedPrisma &&
    hasExpectedDelegates(cachedPrisma) &&
    isServiceModelInSync(cachedPrisma) &&
    isPackagePlanModelInSync(cachedPrisma) &&
    isPortfolioModelInSync(cachedPrisma)
  ) {
    return cachedPrisma;
  }

  if (cachedPrisma) {
    void cachedPrisma.$disconnect().catch(() => undefined);
    globalForPrisma.prisma = undefined;
  }

  const prisma = createPrismaClient();

  if (
    !hasExpectedDelegates(prisma) ||
    !isServiceModelInSync(prisma) ||
    !isPackagePlanModelInSync(prisma) ||
    !isPortfolioModelInSync(prisma)
  ) {
    throw new Error(
      "Prisma client belum sinkron dengan database. Jalankan `npm run prisma:sync-db` lalu restart server dev.",
    );
  }

  globalForPrisma.prisma = prisma;

  return prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient() as PrismaClient;
    const value = Reflect.get(client, property, receiver);

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
}) as PrismaClient;
