'use client';

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
import { useState } from "react";

type Funnel = {
  name: string;
  pages: string[];
};

export function CreateFunnelDialog() {

  const [ funnel, setFunnel ] = useState<Funnel>({
    name: 'My new funnel',
    pages: []
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Funnel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create funnel</DialogTitle>
          <DialogDescription>
            Create a new funnel for your website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={funnel.name}
              onChange={
                (evt) => setFunnel((prev) => ({...prev, name: evt.target.value}))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
