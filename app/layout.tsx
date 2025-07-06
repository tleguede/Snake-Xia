import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
    title: 'My New App',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="rkr9lks">
            <body className="" data-oid="o7gs:23">
                {children}
            </body>
        </html>
    );
}
