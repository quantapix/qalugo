---
layout: single
title: Apps
description: Quickly get a project started with any of our examples ranging from using parts of the framework to custom components and layouts.
aliases: "/apps/"
---

{{< list-examples.inline >}}
{{ range $a := $.Site.Data.apps -}}
  <h2 id="{{ $a.category | urlize }}">{{ $a.category }}</h2>
  <p>{{ $a.description }}</p>
  {{ if eq $a.category "RTL" -}}
    <div class="qal-callout qal-callout-warning">
      <p>The RTL feature is still <strong>experimental</strong>.</p>
    </div>
  {{ end -}}
  {{ range $i, $e := $a.examples -}}
    {{- $len := len $a.examples -}}
    {{ if (eq $i 0) }}<div class="row">{{ end }}
      <div class="col-sm-6 col-md-4 col-xl-3 mb-3">
        <a class="d-block" href="/apps/{{ $e.name | urlize }}/"{{ if in $e.name "RTL" }} hreflang="ar"{{ end }}>
          <img class="img-thumbnail mb-3" srcset="/img/apps/{{ $e.name | urlize }}.png,
                                                  /img/apps/{{ $e.name | urlize }}@2x.png 2x"
                                          src="/img/apps/{{ $e.name | urlize }}.png"
                                          alt=""
                                          width="480" height="300"
                                          loading="lazy">
          <h3 class="h5 mb-1">{{ $e.name }}</h3>
        </a>
        <p class="text-muted">{{ $e.description }}</p>
      </div>
    {{ if (eq (add $i 1) $len) }}</div>{{ end }}
  {{ end -}}
{{ end -}}
{{< /list-examples.inline >}}
