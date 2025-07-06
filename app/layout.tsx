import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Snake XIA - Classic Nokia Snake Game',
    description:
        'Experience the nostalgic Nokia-style Snake game with modern web technologies. Control the snake, eat food, and achieve high scores!',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="rkr9lks">
            <head data-oid="w42hf5i">
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" data-oid="1s8ipto" />
            </head>
            <body className="" data-oid="o7gs:23">
                {children}
            </body>
        </html>
    );
}
