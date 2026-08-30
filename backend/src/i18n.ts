import type { Request } from "express";

const SUPPORTED = ["en", "es", "pt"];
const DEFAULT = "en";

const MESSAGES: Record<string, Record<string, string>> = {
  invalid_status: {
    en: "That is not a valid ticket status.",
    es: "Ese no es un estado de ticket válido.",
    pt: "Esse não é um status de ticket válido.",
  },
  invalid_priority: {
    en: "That is not a valid priority level.",
    es: "Ese no es un nivel de prioridad válido.",
    pt: "Esse não é um nível de prioridade válido.",
  },
  assignee_not_found: {
    en: "The selected agent could not be found.",
    es: "No se encontró el agente seleccionado.",
    pt: "O agente selecionado não foi encontrado.",
  },
  ticket_not_found: {
    en: "This ticket could not be found.",
    es: "No se encontró este ticket.",
    pt: "Este ticket não foi encontrado.",
  },
  subject_required: {
    en: "Please add a subject for the ticket.",
    es: "Agrega un asunto para el ticket.",
    pt: "Adicione um assunto para o ticket.",
  },
  message_required: {
    en: "Please write a message before sending.",
    es: "Escribe un mensaje antes de enviar.",
    pt: "Escreva uma mensagem antes de enviar.",
  },
  email_required: {
    en: "A valid email address is required.",
    es: "Se requiere un correo electrónico válido.",
    pt: "É necessário um e-mail válido.",
  },
  password_too_short: {
    en: "Password must be at least 8 characters.",
    es: "La contraseña debe tener al menos 8 caracteres.",
    pt: "A senha deve ter ao menos 8 caracteres.",
  },
  name_required: {
    en: "Please enter your name.",
    es: "Ingresa tu nombre.",
    pt: "Digite seu nome.",
  },
  not_found: {
    en: "Not found.",
    es: "No encontrado.",
    pt: "Não encontrado.",
  },
  invalid_input: {
    en: "Please check your input and try again.",
    es: "Revisa los datos e intenta de nuevo.",
    pt: "Verifique os dados e tente novamente.",
  },
  server_error: {
    en: "Something went wrong on our end. Please try again.",
    es: "Algo salió mal de nuestro lado. Intenta de nuevo.",
    pt: "Algo deu errado do nosso lado. Tente novamente.",
  },
  not_authenticated: {
    en: "Please sign in to continue.",
    es: "Inicia sesión para continuar.",
    pt: "Faça login para continuar.",
  },
  forbidden: {
    en: "You do not have access to this.",
    es: "No tienes acceso a esto.",
    pt: "Você não tem acesso a isto.",
  },
  email_taken: {
    en: "That email is already registered.",
    es: "Ese correo ya está registrado.",
    pt: "Esse e-mail já está cadastrado.",
  },
  invalid_credentials: {
    en: "Invalid email or password.",
    es: "Correo o contraseña no válidos.",
    pt: "E-mail ou senha inválidos.",
  },
};

export function resolveLocale(req: Request): string {
  const header = String(req.headers["x-locale"] || "").toLowerCase().trim();
  if (SUPPORTED.includes(header)) return header;
  const accept = String(req.headers["accept-language"] || "").toLowerCase();
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2);
    if (SUPPORTED.includes(code)) return code;
  }
  return DEFAULT;
}

export function t(key: string, locale = DEFAULT): string {
  const entry = MESSAGES[key];
  if (!entry) return key;
  return entry[locale] || entry[DEFAULT] || key;
}
