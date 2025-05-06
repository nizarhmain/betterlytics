import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PageDetailClient from "@/app/dashboard/pages/[...path]/PageDetailClient";

export default async function PageDetailPage({ params }: { params: Promise<{ path: string[] }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const paths = await params;

  // Join the path segments and decode
  const fullPath = `/${paths.path.join("/")}`;
  let decodedPath = decodeURIComponent(fullPath);
  
  // Handle special "__index__" case for the homepage
  if (decodedPath === "/__index__") {
    decodedPath = "/";
  }

  return <PageDetailClient path={decodedPath} />;
} 