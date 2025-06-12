import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betterlytics Docs",
  description: "Betterlytics Docs",
  icons: {
    icon: [
      {
        url: "/images/favicon-dark.svg",
        media: "(prefers-color-scheme: light)",
        type: "image/svg+xml",
      },
      {
        url: "/images/favicon-light.svg",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg+xml",
      },
    ],
  },
};

const banner = (
  <Banner storageKey="some-key">
    🚧 Betterlytics Docs is being worked on 🚧
  </Banner>
);
const navbar = <Navbar logo={<b>Betterlytics</b>} />;
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr" // Required to be set
      suppressHydrationWarning
    >
      <Head></Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          sidebar={{ autoCollapse: true }}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/betterlytics/betterlytics/tree/main/docs"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
