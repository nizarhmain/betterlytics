"use server";

import { UserSettings, UserSettingsUpdate } from "@/entities/userSettings";
import { requireAuth } from "@/auth/auth-actions";
import * as UserSettingsService from "@/services/userSettings";

export async function getUserSettingsAction(): Promise<UserSettings> {
  const session = await requireAuth();
  return await UserSettingsService.getUserSettings(session.user.id);
}

export async function updateUserSettingsAction(
  updates: UserSettingsUpdate
): Promise<UserSettings> {
  const session = await requireAuth();
  return await UserSettingsService.updateUserSettings(session.user.id, updates);
}
