---
layout: single
title: Apps
description: Quickly get a project started with any of our examples ranging from using parts of the framework to custom components and layouts.
aliases: "/apps/"
---

{{< list-examples.inline >}}
{{ range $entry := $.Site.Data.apps -}}
  <h2 id="{{ $entry.category | urlize }}">{{ $entry.category }}</h2>
  <p>{{ $entry.description }}</p>
  {{ if eq $entry.category "RTL" -}}
    <div class="qal-callout qal-callout-warning">
      <p>The RTL feature is still <strong>experimental</strong> and will probably evolve according to user feedback. Spotted something or have an improvement to suggest? <a href="{{ $.Site.Params.repo }}/issues/new">Open an issue</a>, we'd love to get your insights.</p>
    </div>
  {{ end -}}

  {{ range $i, $example := $entry.examples -}}
    {{- $len := len $entry.examples -}}
    {{ if (eq $i 0) }}<div class="row">{{ end }}
      <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
        <a class="d-block" href="/apps/{{ $example.name | urlize }}/"{{ if in $example.name "RTL" }} hreflang="ar"{{ end }}>
          <img class="img-thumbnail mb-3" srcset="/img/apps/{{ $example.name | urlize }}.png,
                                                  /img/apps/{{ $example.name | urlize }}@2x.png 2x"
                                          src="/img/apps/{{ $example.name | urlize }}.png"
                                          alt=""
                                          width="480" height="300"
                                          loading="lazy">
          <h3 class="h5 mb-1">{{ $example.name }}</h3>
        </a>
        <p class="text-muted">{{ $example.description }}</p>
      </div>
    {{ if (eq (add $i 1) $len) }}</div>{{ end }}
  {{ end -}}
{{ end -}}
{{< /list-examples.inline >}}
