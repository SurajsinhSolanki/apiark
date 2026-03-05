import { create } from "zustand";
import {
  getLicenseStatus,
  activateLicense as activateLicenseApi,
  deactivateLicense as deactivateLicenseApi,
  type LicenseStatus,
} from "@/lib/tauri-api";

interface LicenseState {
  status: LicenseStatus;
  loaded: boolean;
  loadLicense: () => Promise<void>;
  activate: (key: string) => Promise<LicenseStatus>;
  deactivate: () => Promise<void>;
  isProFeature: (feature: string) => boolean;
}

const PRO_FEATURES = new Set([
  "mock_servers",
  "monitors",
  "docs_gen",
  "response_diff",
  "parallel_runner",
]);

const TEAM_FEATURES = new Set([
  "git_ui",
  "team_env_sharing",
  "sso_saml",
  "audit_logs",
]);

const defaultStatus: LicenseStatus = {
  tier: "free",
  email: null,
  expiresAt: null,
  seats: null,
  gracePeriod: false,
  valid: true,
};

export const useLicenseStore = create<LicenseState>((set, get) => ({
  status: defaultStatus,
  loaded: false,

  loadLicense: async () => {
    try {
      const status = await getLicenseStatus();
      set({ status, loaded: true });
    } catch {
      set({ status: defaultStatus, loaded: true });
    }
  },

  activate: async (key: string) => {
    const status = await activateLicenseApi(key);
    set({ status });
    return status;
  },

  deactivate: async () => {
    const status = await deactivateLicenseApi();
    set({ status });
  },

  isProFeature: (feature: string) => {
    const { tier } = get().status;
    if (PRO_FEATURES.has(feature)) {
      return tier === "pro" || tier === "team";
    }
    if (TEAM_FEATURES.has(feature)) {
      return tier === "team";
    }
    return true; // free features
  },
}));
