import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockStore = new Map<string, string>();
let mockCloudRow: { user_id: string } | null = null;
let mockCloudError: unknown = null;

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: async (key: string) => mockStore.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      mockStore.set(key, value);
    },
  },
}));

jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: mockCloudRow, error: mockCloudError }),
        }),
      }),
    }),
  },
}));

import { onLocalDataReset, prepareLocalDataFor } from "@/lib/sync/localDataReset";

describe("prepareLocalDataFor", () => {
  let resets = 0;
  let unsubscribe: () => void = () => {};
  afterEach(() => unsubscribe());
  beforeEach(() => {
    mockStore.clear();
    mockCloudRow = null;
    mockCloudError = null;
    resets = 0;
    unsubscribe = onLocalDataReset(() => {
      resets++;
    });
  });

  it("starts a brand-new account from zero, even on a device that already holds progress", async () => {
    await prepareLocalDataFor("new-user");
    expect(resets).toBe(1);
    expect(mockStore.get("master-quest.data-owner")).toBe("new-user");
  });

  it("keeps the progress of an existing account that signs in for the first time on a device used without an account", async () => {
    mockCloudRow = { user_id: "old-user" };
    await prepareLocalDataFor("old-user");
    expect(resets).toBe(0);
    expect(mockStore.get("master-quest.data-owner")).toBe("old-user");
  });

  it("does nothing when the same account signs in again", async () => {
    mockStore.set("master-quest.data-owner", "user-a");
    await prepareLocalDataFor("user-a");
    expect(resets).toBe(0);
  });

  it("clears the device when a different account signs in, so nobody inherits someone else's progress", async () => {
    mockStore.set("master-quest.data-owner", "user-a");
    mockCloudRow = { user_id: "user-b" };
    await prepareLocalDataFor("user-b");
    expect(resets).toBe(1);
    expect(mockStore.get("master-quest.data-owner")).toBe("user-b");
  });

  it("never wipes anything when the cloud lookup fails", async () => {
    mockCloudError = new Error("offline");
    await prepareLocalDataFor("user-c");
    expect(resets).toBe(0);
  });

  it("lets a session that was already signed in keep the device's progress, even without a cloud record", async () => {
    await prepareLocalDataFor("restored-user", { restoredSession: true });
    expect(resets).toBe(0);
    expect(mockStore.get("master-quest.data-owner")).toBe("restored-user");
  });
});
