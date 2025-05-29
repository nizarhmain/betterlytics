"server-only";

import { UserSettings, UserSettingsUpdate, DEFAULT_USER_SETTINGS } from "@/entities/userSettings";
import * as UserSettingsRepository from "@/repositories/postgres/userSettings";

export async function getUserSettings(
  userId: string,
): Promise<UserSettings> {
  try {
    const settings = await UserSettingsRepository.findSettingsByUserId(userId);

    if (!settings) {
      return await UserSettingsRepository.createUserSettings(userId, DEFAULT_USER_SETTINGS);
    }

    return settings;
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw new Error("Failed to get user settings");
  }
}

export async function updateUserSettings(
  userId: string,
  updates: UserSettingsUpdate,
): Promise<UserSettings> {
  try {
    return await UserSettingsRepository.updateUserSettings(userId, updates);
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}