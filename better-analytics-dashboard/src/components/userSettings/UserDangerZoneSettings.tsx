"use client";

import { Trash2 } from "lucide-react";
import { UserSettingsUpdate } from "@/entities/userSettings";
import SettingsCard from "../SettingsCard";

interface UserDangerZoneSettingsProps {
  formData: UserSettingsUpdate;
  onUpdate: (updates: Partial<UserSettingsUpdate>) => void;
}

export default function UserDangerZoneSettings({ formData, onUpdate }: UserDangerZoneSettingsProps) {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={Trash2}
        title="Delete Account"
        description="Permanently delete your account and all associated data"
      >
        <div className="text-destructive">
          <p className="font-medium">⚠️ This action cannot be undone</p>
          <p className="text-sm mt-1">Account deletion will be implemented here.</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Delete all personal data</li>
            <li>• Cancel active subscriptions</li>
            <li>• Remove all analytics data</li>
            <li>• Close billing account</li>
          </ul>
        </div>
      </SettingsCard>
    </div>
  );
} 