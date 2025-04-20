// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Build Games with Claude Chat Bot',
  description: 'Generate playable games with Claude AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}