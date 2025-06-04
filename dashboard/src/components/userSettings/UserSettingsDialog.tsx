'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Shield, AlertTriangle, Loader2, Save } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { UserSettingsUpdate } from '@/entities/userSettings';
import { toast } from 'sonner';
import UserPreferencesSettings from '@/components/userSettings/UserPreferencesSettings';
import UserSecuritySettings from '@/components/userSettings/UserSecuritySettings';
import UserDangerZoneSettings from '@/components/userSettings/UserDangerZoneSettings';
import { Spinner } from '../ui/spinner';

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserSettingsTabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType<{
    formData: UserSettingsUpdate;
    onUpdate: (updates: Partial<UserSettingsUpdate>) => void;
  }>;
}

const USER_SETTINGS_TABS: UserSettingsTabConfig[] = [
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Settings,
    component: UserPreferencesSettings,
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    component: UserSecuritySettings,
  },
  {
    id: 'danger',
    label: 'Danger Zone',
    icon: AlertTriangle,
    component: UserDangerZoneSettings,
  },
];

export default function UserSettingsDialog({ open, onOpenChange }: UserSettingsDialogProps) {
  const { settings, isLoading, isSaving, saveSettings } = useUserSettings();
  const [activeTab, setActiveTab] = useState(USER_SETTINGS_TABS[0].id);
  const [formData, setFormData] = useState<UserSettingsUpdate>({});

  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleUpdate = (updates: Partial<UserSettingsUpdate>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    const result = await saveSettings(formData);
    if (result.success) {
      toast.success('Settings saved successfully!');
      onOpenChange(false);
    } else {
      toast.error('Failed to save settings. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[700px]'>
          <div className='flex flex-col items-center justify-center space-y-3 py-16'>
            <Spinner />
            <p className='text-muted-foreground text-sm'>Loading settings...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!settings) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[700px]'>
          <div className='flex items-center justify-center py-8'>
            <span>No settings found</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>Manage your account settings and preferences.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className={`grid w-full grid-cols-${USER_SETTINGS_TABS.length}`}>
            {USER_SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className='flex items-center gap-2'>
                  <Icon className='h-4 w-4' />
                  <span className='hidden sm:inline'>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {USER_SETTINGS_TABS.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className='mt-6'>
                <Component formData={formData} onUpdate={handleUpdate} />
              </TabsContent>
            );
          })}
        </Tabs>

        <div className='flex justify-end space-x-2 border-t pt-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
