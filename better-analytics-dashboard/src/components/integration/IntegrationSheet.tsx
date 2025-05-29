"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Info, Clipboard, Check, Code, RefreshCw, Circle } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDashboardId } from "@/hooks/use-dashboard-id";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteId } from "@/app/actions";

interface IntegrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface IntegrationStatus {
  accountCreated: boolean;
  siteIdGenerated: boolean;
  scriptInstalled: boolean;
  dataReceiving: boolean;
}

export function IntegrationSheet({ open, onOpenChange }: IntegrationSheetProps) {
  const [copiedIdentifier, setCopiedIdentifier] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    accountCreated: false,
    siteIdGenerated: false,
    scriptInstalled: false,
    dataReceiving: false,
  });

  const dashboardId = useDashboardId();
  
  const { data: siteId, isLoading } = useQuery({
    queryKey: ['siteId', dashboardId],
    queryFn: () => fetchSiteId(dashboardId),
  });

  const trackingScript = siteId ? `<script async src="https://analytics.example.com/tracker.js" data-site-id="${siteId}"></script>` : '';

  const handleVerifyInstallation = async () => {
    setVerifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrationStatus({
        accountCreated: true,
        siteIdGenerated: true,
        scriptInstalled: true,
        dataReceiving: true,
      });

      setVerifying(false);
    } catch (err) {
      toast.error("Failed to verify");
    } finally {
      setVerifying(false);
    }
  };

  const handleCopy = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdentifier(identifier);
      setTimeout(() => setCopiedIdentifier(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const htmlExample = `<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
  ${trackingScript}
</head>
<body>
  <!-- Your website content -->
</body>
</html>`;

  const nextJsExample = `import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://analytics.example.com/tracker.js"
          data-site-id="${siteId}"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}`;

  const reactExample = `import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://analytics.example.com/tracker.js";
    script.setAttribute('data-site-id', "${siteId}");
    document.head.appendChild(script);

    return () => {
      // Optional: Remove script when component unmounts
      // document.head.removeChild(script);
    };
  }, []);

  return (
    // Your App content
  );
}

export default App;
`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl p-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-border space-y-1.5">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl">Website Integration</SheetTitle>
              <div className="flex items-center">
                {integrationStatus.accountCreated && integrationStatus.siteIdGenerated && integrationStatus.scriptInstalled && integrationStatus.dataReceiving ? (
                  <Badge className="mr-3 px-2 py-1 text-xs font-medium bg-green-600/20 text-green-500 dark:bg-green-500/30 dark:text-green-400 rounded">Fully Integrated</Badge>
                ) : (
                  <Badge className="mr-3 px-2 py-1 text-xs font-medium bg-red-600/20 text-red-500 dark:bg-red-500/30 dark:text-red-400 rounded">Not Fully Integrated</Badge>
                )}
              </div>
            </div>
            <SheetDescription className="text-sm text-muted-foreground">
              Add the tracking script to your website to start collecting analytics data
            </SheetDescription>
          </SheetHeader>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading integration details...</span>
              </div>
            ) : !siteId ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-muted-foreground">Unable to load site ID</span>
              </div>
            ) : (
              <>
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-base font-medium text-card-foreground">Important</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Add this script to the <code className="bg-muted px-1 py-0.5 rounded text-xs text-orange-600 dark:text-orange-400">&lt;head&gt;</code> section of your root layout or individual pages.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="siteIdDisplay" className="text-sm font-medium text-muted-foreground">Your Site ID</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy(siteId, "siteId")}
                    >
                      {copiedIdentifier === "siteId" ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Clipboard className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div
                    id="siteIdDisplay"
                    className="w-full bg-input border border-border rounded-md p-2 text-sm text-foreground"
                    aria-readonly="true"
                  >
                    {siteId}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="trackingScriptDisplay" className="text-sm font-medium text-muted-foreground">Tracking Script</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy(trackingScript, "trackingScript")}
                    >
                      {copiedIdentifier === "trackingScript" ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Clipboard className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div id="trackingScriptDisplay" className="w-full bg-input border border-border rounded-md p-2 text-sm text-foreground overflow-x-auto">
                    {trackingScript}
                  </div>
                </div>

                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted border-border">
                    <TabsTrigger value="html" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">HTML</TabsTrigger>
                    <TabsTrigger value="nextjs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Next.js</TabsTrigger>
                    <TabsTrigger value="react" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">React</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html" className="p-4 bg-card rounded-md border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-muted-foreground" /> HTML Installation
                    </h3>
                    <CodeBlock code={htmlExample} language="html" />
                  </TabsContent>
                  <TabsContent value="nextjs" className="p-4 bg-card rounded-md border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-muted-foreground" /> Next.js Installation
                    </h3>
                    <CodeBlock code={nextJsExample} language="javascript" />
                  </TabsContent>
                  <TabsContent value="react" className="p-4 bg-card rounded-md border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-muted-foreground" /> React Installation
                    </h3>
                    <CodeBlock code={reactExample} language="javascript" />
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base font-medium text-card-foreground">Integration Status</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">Track your progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <StatusItem label="Account Created" description="Your account is ready" isComplete={integrationStatus.accountCreated} />
                      <StatusItem label="Site ID Generated" description="Your unique identifier" isComplete={integrationStatus.siteIdGenerated} />
                      <StatusItem label="Script Installed" description="Tracking script detected" isComplete={integrationStatus.scriptInstalled} />
                      <StatusItem label="Data Receiving" description="Analytics data flowing" isComplete={integrationStatus.dataReceiving} />
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base font-medium text-card-foreground">Need Help?</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">Resources to get started</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/docs" className="flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                        <Info className="h-4 w-4 mr-2" /> Documentation
                      </Link>
                      <Link href="/docs/troubleshooting" className="flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                        <Info className="h-4 w-4 mr-2" /> Troubleshooting
                      </Link>
                      <Link href="/contact" className="flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                        <Info className="h-4 w-4 mr-2" /> Contact Support
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>

          <div className="p-6 border-t border-border flex justify-end mt-auto sticky bg-background">
            <Button variant="outline" onClick={handleVerifyInstallation} disabled={verifying || !siteId} size="sm">
              {verifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Verify Installation
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 

const StatusItem: React.FC<{ label: string, description: string, isComplete: boolean }> = ({ label, description, isComplete }) => {
  return (
    <div className={`flex items-center ${isComplete ? '' : 'opacity-60'}`}>
      {isComplete ? (
        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0"></Circle>
      )}
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};