import { describe, expect, it } from "@jest/globals";
import { translateAuthError } from "@/lib/supabase/authErrors";

describe("auth errors in plain Polish", () => {
  it("says so when the new password is the same as the old one", () => {
    const sameByMessage = new Error("New password should be different from the old password.");
    const sameByCode = Object.assign(new Error("whatever"), { code: "same_password" });
    for (const error of [sameByMessage, sameByCode]) {
      expect(translateAuthError(error)).toMatch(/to samo hasło/);
    }
  });

  it("explains an expired reset link and a weak password, and keeps the generic fallback for the rest", () => {
    expect(translateAuthError(new Error("Auth session missing!"))).toMatch(/wygasł/);
    expect(translateAuthError(Object.assign(new Error("x"), { code: "weak_password" }))).toMatch(/zbyt słabe/);
    expect(translateAuthError(new Error("Invalid login credentials"))).toBe("Zły e-mail lub hasło.");
    expect(translateAuthError(new Error("something unheard of"))).toMatch(/Coś poszło nie tak/);
  });
});
