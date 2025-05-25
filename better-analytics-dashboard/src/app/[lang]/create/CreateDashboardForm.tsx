"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { createDashboardAction } from "../../actions/dashboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateDashboardForm() {
  const [domain, setDomain] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submitDashboard = () => {
    startTransition(async () => {
      try {
        const dashboard = await createDashboardAction(domain);
        router.push(`/dashboard/${dashboard.id}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to create dashboard.");
      }
    });
  };

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        submitDashboard();
      }}
      className="mt-8 space-y-6"
    >
      <div className="space-y-2">
        <Label className="font-medium text-muted-foreground">Domain</Label>
        <Input
          type="text"
          onChange={(evt) => setDomain(evt.target.value)}
          value={domain}
          className="bg-muted-foreground border-background"
          placeholder="betterlytics.io"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        Create
      </Button>
    </form>
  );
}
