"use client";

import { Key } from "lucide-react";
import { UserSettingsUpdate } from "@/entities/userSettings";
import SettingsCard from "../SettingsCard";

interface UserSecuritySettingsProps {
  formData: UserSettingsUpdate;
  onUpdate: (updates: Partial<UserSettingsUpdate>) => void;
}

export default function UserSecuritySettings({ formData, onUpdate }: UserSecuritySettingsProps) {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={Key}
        title="Password & Authentication"
        description="Manage your password and authentication methods"
      >
        <div className="text-muted-foreground">
          <p>Password and authentication settings will be implemented here.</p>
        </div>
      </SettingsCard>
    </div>
  );
} 