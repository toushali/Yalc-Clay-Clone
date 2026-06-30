import { LocalStorageDataService } from "./localStorageService";
import type { DataService } from "./types";

export type { DataService, PersistedState } from "./types";

/**
 * App-wide singleton so every caller shares one in-memory mirror.
 * Swap this line for a real implementation (same interface) to go to a backend.
 */
export const dataService: DataService = new LocalStorageDataService();
