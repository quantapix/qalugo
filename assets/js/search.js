(function () {
  "use strict";
  var inputElement = document.getElementById("search-input");
  if (!window.docsearch || !inputElement) {
    return;
  }
  var siteDocsVersion = inputElement.getAttribute("data-bd-docs-version");
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "/") {
      event.preventDefault();
      inputElement.focus();
    }
  });
  window.docsearch({
    apiKey: "5990ad008512000bba2cf951ccf0332f",
    indexName: "bootstrap",
    inputSelector: "#search-input",
    algoliaOptions: {
      facetFilters: ["version:" + siteDocsVersion],
    },
    transformData: function (hits) {
      return hits.map(function (hit) {
        var liveUrl = "https://getbootstrap.com/";
        hit.url = window.location.origin.startsWith(liveUrl)
          ? hit.url
          : hit.url.replace(liveUrl, "/");
        if (hit.anchor === "content") {
          hit.url = hit.url.replace(/#content$/, "");
          hit.anchor = null;
        }
        return hit;
      });
    },
    debug: false,
  });
})();
