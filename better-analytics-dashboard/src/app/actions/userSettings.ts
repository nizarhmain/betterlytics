"use server";

import { UserSettings, UserSettingsUpdate } from "@/entities/userSettings";
import { ChangePasswordRequest, ChangePasswordRequestSchema } from "@/entities/password";
import { withUserAuth } from "@/auth/auth-actions";
import * as UserSettingsService from "@/services/userSettings";

export const getUserSettingsAction = withUserAuth(
  async (userId: string): Promise<UserSettings> => {
    return await UserSettingsService.getUserSettings(userId);
  }
);

export const updateUserSettingsAction = withUserAuth(
  async (
    userId: string,
    updates: UserSettingsUpdate
  ): Promise<UserSettings> => {
    return await UserSettingsService.updateUserSettings(userId, updates);
  }
);

export const deleteUserAccountAction = withUserAuth(
  async (userId: string): Promise<void> => {
    return await UserSettingsService.deleteUser(userId);
  }
);

export const changePasswordAction = withUserAuth(
  async (
    userId: string,
    data: ChangePasswordRequest
  ): Promise<void> => {
    const validatedData = ChangePasswordRequestSchema.parse(data);
    
    return await UserSettingsService.changeUserPassword(
      userId, 
      validatedData.currentPassword, 
      validatedData.newPassword
    );
  }
);
