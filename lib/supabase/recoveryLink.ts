/** What the part of the web address after "#" says when the player arrives from the link in the "reset your password" e-mail.
 * Supabase sends them back to the app with "#access_token=…&type=recovery" (a good link) or "#error=access_denied&error_code=otp_expired…"
 * (a link that expired or was already used). */
export interface RecoveryLinkInfo {
  /** A working password-reset link was opened: show the "set a new password" screen. */
  isRecovery: boolean;
  /** The link was bad (expired, already used): tell the player to ask for a new one. */
  isProblem: boolean;
}

export function parseRecoveryHash(hash: string): RecoveryLinkInfo {
  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const isProblem = params.has("error") || params.has("error_code");
  const isRecovery = !isProblem && params.get("type") === "recovery";
  return { isRecovery, isProblem: isProblem && /otp_expired|access_denied|invalid/i.test(`${params.get("error_code") ?? ""} ${params.get("error") ?? ""}`) };
}

/** Where the link in the e-mail should lead back to: this web app's own address (on the web only). Supabase accepts it only when the
 * address is on its "Redirect URLs" list (Authentication → URL Configuration); otherwise it falls back to the project's Site URL. */
export function recoveryRedirectUrl(): string | undefined {
  if (typeof window === "undefined" || typeof document === "undefined") return undefined;
  return `${window.location.origin}/`;
}
