<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta
          name="keywords"
          content={{"codespace, codespace assingments, social media, share code, codespace posts, codespace user, codespace account, post in codespace, codespace blogs" . ($keyword ?? "")}}
        />
        <title key="title">{{ $title ?? env("APP_NAME") }}</title>

        <meta itemProp="name" name="name" content="{{ $title ?? env("APP_NAME") }}" key="name" />
        <meta itemProp="image" name="image" content="{{ env("STORAGE_ROOT") . "/og_image.png" }}" key="image" />
        <meta
          itemProp="description"
          name="description"
          content="{{ $description ?? "With " . env("APP_NAME") . ",you can share posts, and improve your skills." }}"
          key="description"
        />

        <meta
          property="og:url"
          content="{{ env("APP_URL") }}"
          key="og_url"
        />
        <meta property="og:type" content="website" key="og_type" />
        <meta property="og:title" content="{{ $title ?? env("APP_NAME") }}" key="og_name" />
        <meta
          property="og:description"
          content="{{ $description ?? "With " . env("APP_NAME") . ",you can share posts, and improve your skills." }}"
          key="og_description"
        />
        <meta property="og:image" content="{{ env("STORAGE_ROOT") . "/og_image.png" }}" key="og_image" />
        <meta
          property="og:site_name"
          content="{{ env("APP_NAME") }}"
          key="og_site_name"
        />

        <meta name="twitter:card" content="tw_summary_large_image" />
        <meta name="twitter:title" content="{{ $title ?? env("APP_NAME") }}" key="tw_name" />
        <meta
          name="twitter:description"
          content="{{ $description ?? "With " . env("APP_NAME") . ",you can share posts, and improve your skills." }}"
          key="tw_description"
        />
        <meta name="twitter:image" content="{{ env("STORAGE_ROOT") . "/og_image.png" }}" key="tw_image" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body>

        @inertia
    </body>
</html>
