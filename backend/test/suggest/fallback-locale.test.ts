import { describe, expect, it } from "vitest";

import { suggestReply } from "../../src/ai/suggest";
import { makeArticle } from "../fixtures";
import { throwingProvider } from "../stub-provider";

const base = {
  subject: "Help",
  customerName: "Dana Ruiz",
  agentName: "Sam",
  messages: [{ authorType: "CUSTOMER" as const, body: "I need help" }],
  articles: [makeArticle({ title: "Getting started" })],
};

describe("suggestReply localized fallback", () => {
  it("uses an English fallback and greets by first name", async () => {
    const r = await suggestReply({ ...base, locale: "en" }, throwingProvider());
    expect(r.source).toBe("fallback");
    expect(r.reply.startsWith("Hi Dana,")).toBe(true);
  });

  it("uses a Spanish fallback", async () => {
    const r = await suggestReply({ ...base, locale: "es" }, throwingProvider());
    expect(r.reply.startsWith("Hola Dana,")).toBe(true);
    expect(r.reply).toContain("Gracias por escribirnos");
  });

  it("uses a Portuguese fallback", async () => {
    const r = await suggestReply({ ...base, locale: "pt" }, throwingProvider());
    expect(r.reply.startsWith("Olá Dana,")).toBe(true);
    expect(r.reply).toContain("Obrigado por entrar em contato");
  });

  it("references a matched article in the fallback", async () => {
    const r = await suggestReply({ ...base, locale: "en" }, throwingProvider());
    expect(r.reply).toContain("Getting started");
  });
});
