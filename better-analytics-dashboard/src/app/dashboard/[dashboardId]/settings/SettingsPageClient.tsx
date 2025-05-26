"use client";

import { useState, useEffect, useTransition, startTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { DashboardSettings, DashboardSettingsUpdate } from "@/entities/settings";
import { getDashboardSettingsAction, updateDashboardSettingsAction, resetDashboardSettingsAction } from "@/app/actions/settings";
import DisplaySettings from "@/components/settings/DisplaySettings";
import DataSettings from "@/components/settings/DataSettings";
import ReportSettings from "@/components/settings/ReportSettings";
import AlertSettings from "@/components/settings/AlertSettings";

type SettingsPageClientProps = {
  dashboardId: string;
};

export default function SettingsPageClient({ dashboardId }: SettingsPageClientProps) {
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [formData, setFormData] = useState<DashboardSettingsUpdate>({});
  const [activeTab, setActiveTab] = useState("display");
  const [isPendingSave, startTransitionSave] = useTransition();
  const [isPendingReset, startTransitionReset] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getDashboardSettingsAction(dashboardId);
        setSettings(data);
        setFormData({
          showGridLines: data.showGridLines,
          defaultDateRange: data.defaultDateRange,
          dataRetentionDays: data.dataRetentionDays,
          weeklyReports: data.weeklyReports,
          monthlyReports: data.monthlyReports,
          reportRecipients: data.reportRecipients,
          alertsEnabled: data.alertsEnabled,
          alertsThreshold: data.alertsThreshold,
        });
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [dashboardId]);

  const handleUpdate = (updates: Partial<DashboardSettingsUpdate>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    startTransitionSave(async () => {
      try {
        const updatedSettings = await updateDashboardSettingsAction(dashboardId, formData);
        setSettings(updatedSettings);
        toast.success("Settings saved successfully");
      } catch (error) {
        toast.error("Failed to save settings");
      }
    });
  };

  const handleReset = () => {
    startTransitionReset(async () => {
      try {
        const resetSettings = await resetDashboardSettingsAction(dashboardId);
        setSettings(resetSettings);
        setFormData({
          showGridLines: resetSettings.showGridLines,
          defaultDateRange: resetSettings.defaultDateRange,
          dataRetentionDays: resetSettings.dataRetentionDays,
          weeklyReports: resetSettings.weeklyReports,
          monthlyReports: resetSettings.monthlyReports,
          reportRecipients: resetSettings.reportRecipients,
          alertsEnabled: resetSettings.alertsEnabled,
          alertsThreshold: resetSettings.alertsThreshold,
        });
        toast.success("Settings reset to defaults");
      } catch (error) {
        toast.error("Failed to reset settings");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-[1000]">
        <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-accent border-t-primary rounded-full animate-spin mb-2"></div>
          <p className="text-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container mx-auto p-6 max-w-4xl h-full w-full flex flex-col relative items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load settings.</p>
          <p className="text-muted-foreground">Please contact support if the problem persists!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences and data collection settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="display">
          <DisplaySettings formData={formData} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="data">
          <DataSettings formData={formData} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportSettings formData={formData} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertSettings formData={formData} onUpdate={handleUpdate} />
        </TabsContent>

        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isPendingReset || isPendingSave}
          >
            {isPendingReset ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Reset to Defaults
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isPendingSave || isPendingReset}
          >
            {isPendingSave ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </Tabs>
    </div>
  );
} 