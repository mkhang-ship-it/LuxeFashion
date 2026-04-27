<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LuxeFashion</title>
    @if (app()->environment('local'))
        @php
            $figmaDevServer = rtrim(env('FIGMA_VITE_DEV_SERVER', 'http://localhost:5173'), '/');
        @endphp
        <script type="module">
            import RefreshRuntime from "{{ $figmaDevServer }}/@react-refresh";
            RefreshRuntime.injectIntoGlobalHook(window);
            window.$RefreshReg$ = () => {};
            window.$RefreshSig$ = () => (type) => type;
            window.__vite_plugin_react_preamble_installed__ = true;
        </script>
        {{-- In Blade, escape "@vite" as "@@vite" to prevent directive execution --}}
        <script type="module" src="{{ $figmaDevServer }}/@@vite/client"></script>
        <script type="module" src="{{ $figmaDevServer }}/src/main.tsx"></script>
    @else
        @php
            $manifestPath = public_path('build/.vite/manifest.json');
            $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : null;
            $entry = is_array($manifest) ? ($manifest['index.html'] ?? null) : null;
        @endphp

        @if (is_array($entry) && !empty($entry['css']))
            @foreach ($entry['css'] as $cssFile)
                <link rel="stylesheet" href="{{ asset('build/' . $cssFile) }}">
            @endforeach
        @endif

        @if (is_array($entry) && !empty($entry['file']))
            <script type="module" src="{{ asset('build/' . $entry['file']) }}"></script>
        @endif
    @endif
</head>
<body>
    <div id="root"></div>
</body>
</html>
