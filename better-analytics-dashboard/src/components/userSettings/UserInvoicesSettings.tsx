"use client";

import { FileText } from "lucide-react";
import { UserSettingsUpdate } from "@/entities/userSettings";
import SettingsCard from "@/components/SettingsCard";

interface UserInvoicesSettingsProps {
  formData: UserSettingsUpdate;
  onUpdate: (updates: Partial<UserSettingsUpdate>) => void;
}

export default function UserInvoicesSettings({ formData, onUpdate }: UserInvoicesSettingsProps) {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={FileText}
        title="Invoice History"
        description="View and download your billing history"
      >
        <div className="text-muted-foreground">
          <p>Invoice history will be implemented here.</p>
        </div>
      </SettingsCard>

    </div>
  );
} 