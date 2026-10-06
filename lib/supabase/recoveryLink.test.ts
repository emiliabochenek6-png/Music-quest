import { describe, expect, it } from "@jest/globals";
import { parseRecoveryHash } from "@/lib/supabase/recoveryLink";

describe("the link from the password-reset e-mail", () => {
  it("recognises a good link", () => {
    expect(parseRecoveryHash("#access_token=abc&expires_in=3600&refresh_token=def&token_type=bearer&type=recovery")).toEqual({ isRecovery: true, isProblem: false });
  });

  it("recognises an expired or used link", () => {
    expect(parseRecoveryHash("#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired")).toEqual({ isRecovery: false, isProblem: true });
  });

  it("ignores everything else", () => {
    expect(parseRecoveryHash("")).toEqual({ isRecovery: false, isProblem: false });
    expect(parseRecoveryHash("#type=signup&access_token=x")).toEqual({ isRecovery: false, isProblem: false });
  });
});
