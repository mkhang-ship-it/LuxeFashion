<!DOCTYPE html>
<html>
<head>
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
</head>
<body>

<div id="root"></div>

@if (is_array($entry) && !empty($entry['file']))
    <script type="module" src="{{ asset('build/' . $entry['file']) }}"></script>
@endif

</body>
</html>