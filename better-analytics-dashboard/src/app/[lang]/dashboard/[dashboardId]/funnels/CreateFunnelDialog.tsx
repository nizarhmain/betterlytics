'use client';

import { toast } from "sonner";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { postFunnelAction } from "@/app/actions";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCallback, useState, useMemo } from "react";
import { PlusIcon, Trash2 } from "lucide-react";
import { generateTempId } from "@/utils/temporaryId";
import { useDashboardId } from "@/hooks/use-dashboard-id";
import { FunnelPreviewDisplay } from "./FunnelPreviewDisplay";
import { fetchFunnelPreviewAction } from "@/app/actions/funnels";
import { FunnelDetails } from "@/entities/funnels";
import { useDebounce } from "@/hooks/useDebounce";

type Page = {
  value: string;
  key: string;
}

type Funnel = {
  name: string;
  pages: Page[];
  isStrict: boolean;
};

export function CreateFunnelDialog() {
  const dashboardId = useDashboardId();
  const [ funnel, setFunnel ] = useState<Funnel>({
    name: 'My new funnel',
    pages: [
      { key: generateTempId(), value: '' },
      { key: generateTempId(), value: '' },
    ],
    isStrict: true,
  });

  const [ open, setOpen ] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const processedFunnelPages = useMemo(() => {
    return funnel.pages.map(p => p.value).filter(p => p.trim() !== '');
  }, [funnel.pages]);

  const debouncedFunnelName = useDebounce(funnel.name, 500);
  const debouncedFunnelPages = useDebounce(processedFunnelPages, 500);

  const isPreviewEnabled = debouncedFunnelName.trim() !== '' && debouncedFunnelPages.length >= 2;

  const { data: funnelPreviewData, isLoading: isPreviewLoading } = useQuery<FunnelDetails>({
    queryKey: ['funnelPreview', dashboardId, debouncedFunnelName, debouncedFunnelPages.join(','), funnel.isStrict],
    queryFn: async () => {
      return fetchFunnelPreviewAction(dashboardId, debouncedFunnelName, debouncedFunnelPages, funnel.isStrict);
    },
    enabled: isPreviewEnabled,
  });
  
  const submit = useCallback(() => {
    postFunnelAction(
      dashboardId,
      funnel.name,
      funnel.pages.map((f) => f.value),
      funnel.isStrict
    )
      .then(() => {
        toast.success('Funnel created!');
        queryClient.invalidateQueries({ queryKey: ['funnels', dashboardId] });
        setOpen(false);
      })
      .catch(() => toast.error('Funnel creation failed!'));
  }, [funnel, queryClient, dashboardId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Create Funnel
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80dvw] h-[70dvh] bg-background flex flex-col">
        <DialogHeader>
          <DialogTitle>Create funnel</DialogTitle>
          <DialogDescription>
            Create a new funnel for your website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-start gap-4 pb-4">
              <div className="flex-grow">
                <Label htmlFor="name" className="block mb-1 text-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="My Funnel Name"
                  className="w-full bg-input placeholder:text-muted-foreground"
                  value={funnel.name}
                  onChange={
                    (evt) => setFunnel((prev) => ({...prev, name: evt.target.value}))
                  }
                />
              </div>
              <div className="flex flex-col items-center space-y-1 pt-1">
                <Label htmlFor="strict-mode" className="text-xs whitespace-nowrap">
                  Strict Mode
                </Label>
                <Switch
                  id="strict-mode"
                  checked={funnel.isStrict}
                  onCheckedChange={(checked: boolean) => setFunnel((prev) => ({ ...prev, isStrict: checked }))}
                />
              </div>
              <div className="mt-auto">
                <Button
                  variant="outline"
                  onClick={() => setFunnel((prev) => ({ ...prev, pages: [ ...prev.pages, { key: generateTempId(), value: '' }] }))}
                  className="whitespace-nowrap"
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Add Step
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-card rounded-lg shadow">
              <div className="grid gap-4">
                {
                  funnel
                    .pages
                    .map((page, index) => (
                      <div key={page.key} className="flex gap-2 items-center">
                        <Label htmlFor="page" className="text-card-foreground">
                          Page
                        </Label>
                        <Input
                          id="page"
                          placeholder="/hello/world"
                          className="flex-grow bg-input placeholder:text-muted-foreground"
                          value={page.value}
                          onChange={
                            (evt) => setFunnel((prev) => {
                              const newPages = [
                                ...prev.pages
                              ];
                              newPages[index] = {
                                ...newPages[index],
                                value: evt.target.value
                              };
                              return {
                                ...prev,
                                pages: newPages
                              }
                            })
                          }
                        />
                        <Button
                          className="size-9 shrink-0"
                          variant='outline'
                          onClick={() => setFunnel((prev) => ({ ...prev, pages: prev.pages.filter((_page) => _page.key !== page.key) }))}
                          disabled={funnel.pages.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 bg-card rounded-lg p-4 shadow flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Live Preview (Past 24 Hours)</h3>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <FunnelPreviewDisplay funnelDetails={funnelPreviewData} isLoading={isPreviewLoading} />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-auto pt-2">
          <Button type="submit" onClick={submit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
