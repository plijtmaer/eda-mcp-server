export const metadata = {
  title: "EDA MCP Server - Exploratory Data Analysis Platform",
  description: "AI-powered Exploratory Data Analysis MCP server with TypeScript/Python integration for comprehensive data analysis workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
