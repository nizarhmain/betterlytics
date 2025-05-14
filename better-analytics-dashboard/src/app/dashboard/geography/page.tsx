import React from 'react';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import GeographyClient from './GeographyClient';

export const metadata = {
  title: 'Geography - Better Analytics',
  description: 'Geographic distribution of website visitors',
};

export default async function GeographyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  
  return <GeographyClient />;
} 