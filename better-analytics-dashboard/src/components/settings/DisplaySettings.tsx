"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Monitor } from "lucide-react";
import { DashboardSettingsUpdate } from "@/entities/settings";
import { TIME_RANGE_PRESETS } from "@/utils/timeRanges";

type DisplaySettingsProps = {
  formData: DashboardSettingsUpdate;
  onUpdate: (updates: Partial<DashboardSettingsUpdate>) => void;
};

export default function DisplaySettings({ formData, onUpdate }: DisplaySettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor size={20} />
            Display Settings
          </CardTitle>
          <CardDescription>
            Customize how your dashboard appears and behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Grid Lines</Label>
              <p className="text-sm text-muted-foreground">
                Display grid lines on charts and graphs
              </p>
            </div>
            <Switch 
              checked={formData.showGridLines ?? false}
              onCheckedChange={(checked) => 
                onUpdate({ showGridLines: checked })
              }
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label className="text-base">Default Date Range</Label>
            <p className="text-sm text-muted-foreground mb-2">
              The default time period shown when fetching data for the dashboard and when not explicitly specified.
            </p>
            <Select 
              value={formData.defaultDateRange || "7d"}
              onValueChange={(value) => 
                onUpdate({ defaultDateRange: value as any })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGE_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 