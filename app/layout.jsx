import './globals.css';

export const metadata = {
  title: "Emerald Grove Digital",
  description: "Where AI meets organic imagination.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
