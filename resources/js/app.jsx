import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContextProvider } from "./providers/ThemeProvider";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            cacheTime: false,
        },
    },
});


window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: "ce110553ea9d177e82b8",
    cluster: "eu",
    encrypted: true
});

createInertiaApp({
    title: (title) => title,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <ThemeContextProvider>
                    <div className="toaster">
                        <Toaster />
                    </div>
                    <App {...props} />
                </ThemeContextProvider>
            </QueryClientProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
