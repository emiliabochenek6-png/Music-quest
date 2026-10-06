/** Supabase's own AuthError messages are English and written for a
 * developer console, not a parent filling in a form — maps the handful
 * that actually show up in normal use (wrong password, duplicate
 * signup, weak password, unconfirmed email) to plain Polish, falling
 * back to a generic message for anything else rather than leaking a raw
 * English string into the UI. */
export function translateAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  const code = typeof (error as { code?: unknown } | null)?.code === "string" ? ((error as { code: string }).code).toLowerCase() : "";

  // A new password equal to the old one ("New password should be different from the old password.", code "same_password").
  if (code === "same_password" || lower.includes("different from the old password") || lower.includes("same as the old password")) {
    return "To jest dokładnie to samo hasło co dotychczasowe. Wpisz inne, nowe hasło.";
  }
  // The recovery session is gone: the link in the e-mail expired or was already used.
  if (code === "session_not_found" || lower.includes("auth session missing") || lower.includes("session missing")) {
    return "Ten link do resetu hasła wygasł albo został już użyty. Wróć do logowania i wyślij nowy.";
  }
  // Too weak (the project can ask for more than 6 characters).
  if (code === "weak_password" || lower.includes("weak password")) {
    return "To hasło jest zbyt słabe. Użyj dłuższego, np. z literami i cyframi.";
  }

  if (lower.includes("invalid login credentials")) {
    return "Zły e-mail lub hasło.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "Konto z tym adresem e-mail już istnieje — zaloguj się zamiast zakładać nowe.";
  }
  if (lower.includes("password") && lower.includes("6 character")) {
    return "Hasło musi mieć co najmniej 6 znaków.";
  }
  if (lower.includes("email not confirmed")) {
    return "Potwierdź adres e-mail (link w wiadomości, którą wysłaliśmy) zanim się zalogujesz.";
  }
  if (lower.includes("unable to validate email") || lower.includes("invalid email")) {
    return "To nie wygląda na poprawny adres e-mail.";
  }
  // Browsers word a failed request very differently from each other —
  // Chrome's fetch() rejects with "Failed to fetch" (catches on
  // "fetch"), but Safari's own wording ("The network connection was
  // lost", "Load failed") doesn't contain "fetch" at all, so relying on
  // that one word alone silently misses it there and falls through to
  // the generic message below — which reads as "something mysterious
  // went wrong" when it's really just a plain connectivity failure.
  if (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("load failed") ||
    lower.includes("connection was lost") ||
    lower.includes("could not connect") ||
    lower.includes("timed out") ||
    lower.includes("timeout")
  ) {
    return "Brak połączenia z internetem — spróbuj ponownie.";
  }
  return "Coś poszło nie tak. Spróbuj ponownie.";
}
