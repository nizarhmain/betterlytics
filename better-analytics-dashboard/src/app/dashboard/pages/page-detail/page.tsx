import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PageDetailClient from "./PageDetailClient";

interface SearchParams {
  path?: string;
}

export default async function PageDetailPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session || !params.path) {
    redirect("/");
  }

  let decodedPath = decodeURIComponent(params.path);
  
  return <PageDetailClient path={decodedPath} />;
} 