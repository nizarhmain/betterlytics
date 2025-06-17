'use server';

import { UserSettings, UserSettingsUpdate } from '@/entities/userSettings';
import { ChangePasswordRequest, ChangePasswordRequestSchema } from '@/entities/password';
import { withUserAuth } from '@/auth/auth-actions';
import * as UserSettingsService from '@/services/userSettings';
import { User } from 'next-auth';

export const getUserSettingsAction = withUserAuth(async (user: User): Promise<UserSettings> => {
  return await UserSettingsService.getUserSettings(user.id);
});

export const updateUserSettingsAction = withUserAuth(
  async (user: User, updates: UserSettingsUpdate): Promise<UserSettings> => {
    return await UserSettingsService.updateUserSettings(user.id, updates);
  },
);

export const deleteUserAccountAction = withUserAuth(async (user: User): Promise<void> => {
  return await UserSettingsService.deleteUser(user.id);
});

export const changePasswordAction = withUserAuth(
  async (user: User, data: ChangePasswordRequest): Promise<void> => {
    const validatedData = ChangePasswordRequestSchema.parse(data);

    return await UserSettingsService.changeUserPassword(
      user.id,
      validatedData.currentPassword,
      validatedData.newPassword,
    );
  },
);
