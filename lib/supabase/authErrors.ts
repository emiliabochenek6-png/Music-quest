/** Supabase's own AuthError messages are English and written for a
 * developer console, not a parent filling in a form — maps the handful
 * that actually show up in normal use (wrong password, duplicate
 * signup, weak password, unconfirmed email) to plain Polish, falling
 * back to a generic message for anything else rather than leaking a raw
 * English string into the UI. */
export function translateAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

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
