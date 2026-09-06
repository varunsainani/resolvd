import type {
  ChannelValue,
  SentimentValue,
  TicketPriorityValue,
  TicketStatusValue,
} from "../src/lib/constants";

// Static, deterministic seed content. Kept separate from the runner so the
// dataset can be validated by a unit test (referential integrity, known enums)
// without a database, and so the runner stays about mechanics only.

export interface SeedUser {
  name: string;
  email: string;
  role: "admin" | "agent";
  avatarColor: string;
}

// Password is shared across the seeded demo accounts for easy exploration.
export const SEED_PASSWORD = "demo1234";

export const SEED_USERS: SeedUser[] = [
  { name: "Alex Morgan", email: "admin@resolvd.app", role: "admin", avatarColor: "#0ea5a4" },
  { name: "Demo Agent", email: "demo@resolvd.app", role: "agent", avatarColor: "#6366f1" },
  { name: "Priya Nair", email: "priya@resolvd.app", role: "agent", avatarColor: "#db2777" },
  { name: "Diego Castro", email: "diego@resolvd.app", role: "agent", avatarColor: "#d97706" },
  { name: "Sam Lee", email: "sam@resolvd.app", role: "agent", avatarColor: "#2563eb" },
];

export interface SeedKb {
  title: string;
  body: string;
  category: string;
  keywords: string;
}

export const SEED_KB: SeedKb[] = [
  {
    title: "Fixing a double charge",
    category: "Billing",
    keywords: "refund charge billing duplicate payment double",
    body: "If a customer was billed twice, confirm the duplicate in the billing dashboard, then issue a refund for the extra charge from Billing > Transactions > Refund. Refunds settle back to the original card within 5 to 10 business days.",
  },
  {
    title: "Resetting your password",
    category: "Account",
    keywords: "password reset login account security forgot",
    body: "Go to Settings > Security and choose Reset password, or use the Forgot password link on the sign-in page. The reset link is valid for 30 minutes. If it expired, request a new one.",
  },
  {
    title: "Creating and using API keys",
    category: "Integration",
    keywords: "api key integration webhook token secret",
    body: "Create an API key under Settings > Developers > API keys. Treat the secret like a password; it is shown only once. Pass it as a Bearer token in the Authorization header on every request.",
  },
  {
    title: "Troubleshooting sign-in problems",
    category: "Technical",
    keywords: "login sign-in error 2fa access locked",
    body: "For sign-in failures, first confirm the email is correct and caps lock is off. If two-factor codes are rejected, check the device clock is in sync. Five failed attempts lock the account for 15 minutes.",
  },
  {
    title: "Getting started with Resolvd",
    category: "Onboarding",
    keywords: "onboarding setup getting started welcome first",
    body: "Welcome. Start by inviting your team under Settings > Team, then connect your support inbox so tickets flow in automatically. The dashboard fills in as tickets arrive.",
  },
  {
    title: "Requesting a refund",
    category: "Billing",
    keywords: "refund money-back cancel billing subscription",
    body: "Refunds are available within 30 days of a charge. Cancel the subscription first under Billing > Plan, then request the refund. Prorated amounts are calculated automatically.",
  },
  {
    title: "The mobile app keeps crashing",
    category: "Bug",
    keywords: "mobile app crash ios android bug freeze",
    body: "If the mobile app crashes on launch, update to the latest version, then clear the app cache. If it persists, capture the device model and OS version and attach them to the ticket for engineering.",
  },
  {
    title: "Connecting Slack and Zapier",
    category: "Integration",
    keywords: "integration slack zapier connect automation",
    body: "Open Settings > Integrations and pick the service to connect. Slack posts new-ticket alerts to a channel you choose; Zapier lets you trigger workflows on ticket events.",
  },
];

export interface SeedCanned {
  title: string;
  body: string;
  category: string;
}

export const SEED_CANNED: SeedCanned[] = [
  {
    title: "Password reset steps",
    category: "Account",
    body: "Hi there,\n\nHead to Settings > Security and click Reset password, or use the Forgot password link on the sign-in page. The link stays valid for 30 minutes. Let me know if you hit any snags.",
  },
  {
    title: "Refund acknowledgement",
    category: "Billing",
    body: "Hi,\n\nThanks for flagging this. I can see the duplicate charge and I've started a refund for the extra amount. It should land back on your card within 5 to 10 business days.",
  },
  {
    title: "We're looking into it",
    category: "General",
    body: "Hi,\n\nThanks for reaching out. I'm looking into this now and will follow up shortly with an update. I appreciate your patience.",
  },
  {
    title: "Request more details",
    category: "General",
    body: "Hi,\n\nHappy to help. So I can dig in, could you share the exact steps you took and a screenshot of what you're seeing? That will help me get to the bottom of it.",
  },
  {
    title: "Escalation notice",
    category: "Technical",
    body: "Hi,\n\nI've escalated this to our engineering team so we can get it resolved properly. I'll keep you posted here as soon as I have news.",
  },
  {
    title: "Welcome aboard",
    category: "Onboarding",
    body: "Hi and welcome,\n\nGreat to have you on board. A good first step is inviting your team and connecting your support inbox. I'm here if any questions come up along the way.",
  },
];

export interface SeedMessage {
  author: "CUSTOMER" | "AGENT";
  body: string;
  minsAfterCreate: number;
  isInternal?: boolean;
}

export interface SeedTicket {
  daysAgo: number;
  hour: number;
  subject: string;
  customer: { name: string; email: string; company?: string };
  channel: ChannelValue;
  priority: TicketPriorityValue;
  category: string;
  sentiment: SentimentValue;
  summary: string;
  status: TicketStatusValue;
  assignee: string | null;
  aiTriaged: boolean;
  tags: string[];
  firstResponseMins: number | null;
  resolveMins: number | null;
  messages: SeedMessage[];
}

export const SEED_TICKETS: SeedTicket[] = [
  {
    daysAgo: 0,
    hour: 9,
    subject: "Charged twice for this month's plan",
    customer: { name: "Dana Ruiz", email: "dana.ruiz@northwind.co", company: "Northwind" },
    channel: "EMAIL",
    priority: "URGENT",
    category: "Billing",
    sentiment: "NEGATIVE",
    summary: "Customer was billed twice this month and wants the duplicate refunded.",
    status: "OPEN",
    assignee: null,
    aiTriaged: true,
    tags: ["urgent", "refund", "payment"],
    firstResponseMins: null,
    resolveMins: null,
    messages: [
      { author: "CUSTOMER", body: "I just noticed two identical charges for my plan this month. Please refund the extra one, this is really frustrating.", minsAfterCreate: 0 },
    ],
  },
  {
    daysAgo: 0,
    hour: 11,
    subject: "Can't log in after enabling 2FA",
    customer: { name: "Marcus Bell", email: "marcus@brightlabs.io", company: "Bright Labs" },
    channel: "CHAT",
    priority: "HIGH",
    category: "Technical",
    sentiment: "NEGATIVE",
    summary: "Two-factor codes are being rejected at sign-in.",
    status: "PENDING",
    assignee: "priya@resolvd.app",
    aiTriaged: true,
    tags: ["login", "urgent"],
    firstResponseMins: 22,
    resolveMins: null,
    messages: [
      { author: "CUSTOMER", body: "Ever since I turned on 2FA my codes don't work. I'm locked out.", minsAfterCreate: 0 },
      { author: "AGENT", body: "Sorry about that, Marcus. Can you check that your phone's clock is set to automatic? Authenticator codes fail when the device time drifts.", minsAfterCreate: 22 },
    ],
  },
  {
    daysAgo: 1,
    hour: 14,
    subject: "How do I create an API key?",
    customer: { name: "Lena Fox", email: "lena@datapeak.dev", company: "DataPeak" },
    channel: "WEB",
    priority: "NORMAL",
    category: "Integration",
    sentiment: "NEUTRAL",
    summary: "Customer needs help generating an API key for their integration.",
    status: "RESOLVED",
    assignee: "diego@resolvd.app",
    aiTriaged: true,
    tags: ["api", "how-to"],
    firstResponseMins: 35,
    resolveMins: 180,
    messages: [
      { author: "CUSTOMER", body: "Where do I generate an API key? I want to connect our internal tool.", minsAfterCreate: 0 },
      { author: "AGENT", body: "You can create one under Settings > Developers > API keys. Note the secret is shown only once, so store it safely.", minsAfterCreate: 35 },
      { author: "CUSTOMER", body: "Found it, thank you.", minsAfterCreate: 150 },
    ],
  },
  {
    daysAgo: 1,
    hour: 16,
    subject: "Mobile app crashes on launch",
    customer: { name: "Omar Haddad", email: "omar@finchpay.com", company: "FinchPay" },
    channel: "EMAIL",
    priority: "HIGH",
    category: "Bug",
    sentiment: "NEGATIVE",
    summary: "iOS app crashes immediately on open after the latest update.",
    status: "OPEN",
    assignee: "sam@resolvd.app",
    aiTriaged: true,
    tags: ["mobile", "bug"],
    firstResponseMins: 48,
    resolveMins: null,
    messages: [
      { author: "CUSTOMER", body: "The iOS app crashes the second it opens since the last update. iPhone 14, iOS 18.", minsAfterCreate: 0 },
      { author: "AGENT", body: "Thanks for the details, Omar. I've logged your device info and escalated this to engineering.", minsAfterCreate: 48, isInternal: false },
      { author: "AGENT", body: "Repro confirmed on iOS 18 with the 4.2.0 build. Handing to mobile team.", minsAfterCreate: 55, isInternal: true },
    ],
  },
  {
    daysAgo: 2,
    hour: 10,
    subject: "Refund for annual plan I cancelled",
    customer: { name: "Priya Shah", email: "priya.shah@quillbook.com", company: "Quillbook" },
    channel: "EMAIL",
    priority: "NORMAL",
    category: "Billing",
    sentiment: "NEUTRAL",
    summary: "Customer cancelled the annual plan and expects a prorated refund.",
    status: "RESOLVED",
    assignee: "diego@resolvd.app",
    aiTriaged: true,
    tags: ["refund", "payment"],
    firstResponseMins: 60,
    resolveMins: 420,
    messages: [
      { author: "CUSTOMER", body: "I cancelled my annual plan last week. When do I get the prorated refund?", minsAfterCreate: 0 },
      { author: "AGENT", body: "I've processed the prorated refund for the unused months. It'll land within 5 to 10 business days.", minsAfterCreate: 60 },
    ],
  },
  {
    daysAgo: 3,
    hour: 13,
    subject: "Slack notifications stopped working",
    customer: { name: "Tomás Vidal", email: "tomas@lumen.mx", company: "Lumen" },
    channel: "WEB",
    priority: "NORMAL",
    category: "Integration",
    sentiment: "NEUTRAL",
    summary: "New-ticket alerts are no longer posting to Slack.",
    status: "PENDING",
    assignee: "priya@resolvd.app",
    aiTriaged: false,
    tags: ["api"],
    firstResponseMins: 90,
    resolveMins: null,
    messages: [
      { author: "CUSTOMER", body: "Our Slack channel stopped getting new-ticket alerts yesterday.", minsAfterCreate: 0 },
      { author: "AGENT", body: "Thanks for flagging. Could you reconnect Slack under Settings > Integrations and let me know if alerts resume?", minsAfterCreate: 90 },
    ],
  },
  {
    daysAgo: 4,
    hour: 9,
    subject: "Getting started, where do I begin?",
    customer: { name: "Grace Kim", email: "grace@sprout.io", company: "Sprout" },
    channel: "CHAT",
    priority: "LOW",
    category: "Onboarding",
    sentiment: "POSITIVE",
    summary: "New customer asking for onboarding guidance.",
    status: "RESOLVED",
    assignee: "sam@resolvd.app",
    aiTriaged: true,
    tags: ["onboarding", "how-to"],
    firstResponseMins: 15,
    resolveMins: 120,
    messages: [
      { author: "CUSTOMER", body: "Just signed up and loving it so far. What's the best first step?", minsAfterCreate: 0 },
      { author: "AGENT", body: "Welcome aboard, Grace. Invite your team and connect your support inbox first, then the dashboard fills in as tickets arrive.", minsAfterCreate: 15 },
    ],
  },
  {
    daysAgo: 5,
    hour: 15,
    subject: "Invoice missing VAT details",
    customer: { name: "Dana Ruiz", email: "dana.ruiz@northwind.co", company: "Northwind" },
    channel: "EMAIL",
    priority: "LOW",
    category: "Billing",
    sentiment: "NEUTRAL",
    summary: "Customer needs VAT details added to their invoice.",
    status: "CLOSED",
    assignee: "diego@resolvd.app",
    aiTriaged: false,
    tags: ["payment"],
    firstResponseMins: 200,
    resolveMins: 1400,
    messages: [
      { author: "CUSTOMER", body: "Our finance team needs the VAT number on the invoice. Can you reissue it?", minsAfterCreate: 0 },
      { author: "AGENT", body: "Done. I've added your VAT number and reissued the invoice to your billing email.", minsAfterCreate: 200 },
    ],
  },
  {
    daysAgo: 6,
    hour: 12,
    subject: "Feature request: dark mode",
    customer: { name: "Ivan Petrov", email: "ivan@nimbus.app", company: "Nimbus" },
    channel: "WEB",
    priority: "LOW",
    category: "Feature Request",
    sentiment: "POSITIVE",
    summary: "Customer would like a dark mode option.",
    status: "OPEN",
    assignee: null,
    aiTriaged: true,
    tags: ["feature-request"],
    firstResponseMins: null,
    resolveMins: null,
    messages: [
      { author: "CUSTOMER", body: "Any chance of a dark mode? Would love to use it at night.", minsAfterCreate: 0 },
    ],
  },
  {
    daysAgo: 7,
    hour: 8,
    subject: "Outage: dashboard won't load",
    customer: { name: "Marcus Bell", email: "marcus@brightlabs.io", company: "Bright Labs" },
    channel: "PHONE",
    priority: "URGENT",
    category: "Technical",
    sentiment: "NEGATIVE",
    summary: "Customer reports the dashboard fails to load entirely.",
    status: "RESOLVED",
    assignee: "priya@resolvd.app",
    aiTriaged: true,
    tags: ["outage", "urgent"],
    firstResponseMins: 12,
    resolveMins: 95,
    messages: [
      { author: "CUSTOMER", body: "The whole dashboard is blank for our team right now. Nothing loads.", minsAfterCreate: 0 },
      { author: "AGENT", body: "We identified a caching issue and pushed a fix. Can you confirm it loads for you now?", minsAfterCreate: 12 },
      { author: "CUSTOMER", body: "Yes, back to normal. Thanks for the quick turnaround.", minsAfterCreate: 80 },
    ],
  },
  {
    daysAgo: 9,
    hour: 17,
    subject: "Can I export my data?",
    customer: { name: "Lena Fox", email: "lena@datapeak.dev", company: "DataPeak" },
    channel: "CHAT",
    priority: "NORMAL",
    category: "Account",
    sentiment: "NEUTRAL",
    summary: "Customer asks how to export their account data.",
    status: "CLOSED",
    assignee: "sam@resolvd.app",
    aiTriaged: false,
    tags: ["how-to"],
    firstResponseMins: 40,
    resolveMins: 300,
    messages: [
      { author: "CUSTOMER", body: "Is there a way to export all our tickets to CSV?", minsAfterCreate: 0 },
      { author: "AGENT", body: "Yes, under Settings > Data you can export everything to CSV. I've enabled it for your account.", minsAfterCreate: 40 },
    ],
  },
  {
    daysAgo: 11,
    hour: 10,
    subject: "Webhook returning 401 errors",
    customer: { name: "Omar Haddad", email: "omar@finchpay.com", company: "FinchPay" },
    channel: "WEB",
    priority: "HIGH",
    category: "Integration",
    sentiment: "NEGATIVE",
    summary: "Customer's webhook calls are failing with 401 unauthorized.",
    status: "RESOLVED",
    assignee: "diego@resolvd.app",
    aiTriaged: true,
    tags: ["api", "bug"],
    firstResponseMins: 30,
    resolveMins: 240,
    messages: [
      { author: "CUSTOMER", body: "All our webhook calls suddenly return 401. Nothing changed on our side.", minsAfterCreate: 0 },
      { author: "AGENT", body: "Your API key was rotated during last week's security update. Generate a fresh key and update the header, that clears the 401.", minsAfterCreate: 30 },
    ],
  },
  {
    daysAgo: 12,
    hour: 14,
    subject: "Thanks for the great support",
    customer: { name: "Grace Kim", email: "grace@sprout.io", company: "Sprout" },
    channel: "EMAIL",
    priority: "LOW",
    category: "General",
    sentiment: "POSITIVE",
    summary: "Customer sent positive feedback about the support team.",
    status: "CLOSED",
    assignee: "priya@resolvd.app",
    aiTriaged: true,
    tags: [],
    firstResponseMins: 180,
    resolveMins: 240,
    messages: [
      { author: "CUSTOMER", body: "Just wanted to say your team has been fantastic this month. Keep it up.", minsAfterCreate: 0 },
      { author: "AGENT", body: "That means a lot, Grace. Thank you for taking the time to share it.", minsAfterCreate: 180 },
    ],
  },
  {
    daysAgo: 13,
    hour: 11,
    subject: "Account upgrade didn't apply",
    customer: { name: "Ivan Petrov", email: "ivan@nimbus.app", company: "Nimbus" },
    channel: "EMAIL",
    priority: "NORMAL",
    category: "Account",
    sentiment: "NEUTRAL",
    summary: "Customer upgraded but still sees the old plan limits.",
    status: "RESOLVED",
    assignee: "sam@resolvd.app",
    aiTriaged: true,
    tags: ["payment"],
    firstResponseMins: 70,
    resolveMins: 260,
    messages: [
      { author: "CUSTOMER", body: "I upgraded to the Pro plan but I'm still hitting the free-tier limits.", minsAfterCreate: 0 },
      { author: "AGENT", body: "Thanks for your patience. I refreshed your plan on the backend and the Pro limits are active now.", minsAfterCreate: 70 },
    ],
  },
];
