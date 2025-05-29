"use client";

import { CreditCard, BarChart3, Zap } from "lucide-react";
import { UserSettingsUpdate } from "@/entities/userSettings";
import SettingsCard from "../SettingsCard";

interface UserSubscriptionSettingsProps {
  formData: UserSettingsUpdate;
  onUpdate: (updates: Partial<UserSettingsUpdate>) => void;
}

export default function UserSubscriptionSettings({ formData, onUpdate }: UserSubscriptionSettingsProps) {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={Zap}
        title="Current Plan"
        description="Your subscription plan and benefits"
      >
        <div className="text-muted-foreground">
          <p>Current plan details will be implemented here.</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Plan name and features</li>
            <li>Billing cycle</li>
            <li>Next billing date</li>
            <li>Upgrade/downgrade options</li>
          </ul>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={BarChart3}
        title="Usage Statistics"
        description="Track your usage against plan limits"
      >
        <div className="text-muted-foreground">
          <p>Usage tracking will be implemented here (Monthly page views)</p>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={CreditCard}
        title="Payment Method"
        description="Manage your payment information"
      >
        <div className="text-muted-foreground">
          <p>Payment method management will be implemented here.</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Update credit card</li>
            <li>Billing address</li>
            <li>Payment history</li>
            <li>Auto-renewal settings</li>
            <li>etc</li>
          </ul>
        </div>
      </SettingsCard>
    </div>
  );
} 