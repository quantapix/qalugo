(function () {
  "use strict";
  document.querySelectorAll(".tooltip-demo").forEach(function (tooltip) {
    new bootstrap.Tooltip(tooltip, {
      selector: '[data-bs-toggle="tooltip"]',
    });
  });
  document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(function (popover) {
      new bootstrap.Popover(popover);
    });
  var toastPlacement = document.getElementById("toastPlacement");
  if (toastPlacement) {
    document
      .getElementById("selectToastPlacement")
      .addEventListener("change", function () {
        if (!toastPlacement.dataset.originalClass) {
          toastPlacement.dataset.originalClass = toastPlacement.className;
        }
        toastPlacement.className =
          toastPlacement.dataset.originalClass + " " + this.value;
      });
  }
  document.querySelectorAll(".bd-example .toast").forEach(function (toastNode) {
    var toast = new bootstrap.Toast(toastNode, {
      autohide: false,
    });
    toast.show();
  });
  var toastTrigger = document.getElementById("liveToastBtn");
  var toastLiveExample = document.getElementById("liveToast");
  if (toastTrigger) {
    toastTrigger.addEventListener("click", function () {
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
    });
  }
  document.querySelectorAll(".tooltip-test").forEach(function (tooltip) {
    new bootstrap.Tooltip(tooltip);
  });
  document.querySelectorAll(".popover-test").forEach(function (popover) {
    new bootstrap.Popover(popover);
  });
  document
    .querySelectorAll('.bd-example-indeterminate [type="checkbox"]')
    .forEach(function (checkbox) {
      checkbox.indeterminate = true;
    });
  document.querySelectorAll('.bd-content [href="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });
  var exampleModal = document.getElementById("exampleModal");
  if (exampleModal) {
    exampleModal.addEventListener("show.bs.modal", function (event) {
      var button = event.relatedTarget;
      var recipient = button.getAttribute("data-bs-whatever");
      var modalTitle = exampleModal.querySelector(".modal-title");
      var modalBodyInput = exampleModal.querySelector(".modal-body input");
      modalTitle.textContent = "New message to " + recipient;
      modalBodyInput.value = recipient;
    });
  }
  var btnToggleAnimatedProgress = document.getElementById(
    "btnToggleAnimatedProgress"
  );
  if (btnToggleAnimatedProgress) {
    btnToggleAnimatedProgress.addEventListener("click", function () {
      btnToggleAnimatedProgress.parentNode
        .querySelector(".progress-bar-striped")
        .classList.toggle("progress-bar-animated");
    });
  }
  var btnHtml =
    '<div class="bd-clipboard"><button type="button" class="btn-clipboard" title="Copy to clipboard">Copy</button></div>';
  document.querySelectorAll("div.highlight").forEach(function (element) {
    element.insertAdjacentHTML("beforebegin", btnHtml);
  });
  document.querySelectorAll(".btn-clipboard").forEach(function (btn) {
    var tooltipBtn = new bootstrap.Tooltip(btn);
    btn.addEventListener("mouseleave", function () {
      tooltipBtn.hide();
    });
  });
  var clipboard = new ClipboardJS(".btn-clipboard", {
    target: function (trigger) {
      return trigger.parentNode.nextElementSibling;
    },
  });
  clipboard.on("success", function (e) {
    var tooltipBtn = bootstrap.Tooltip.getInstance(e.trigger);
    e.trigger.setAttribute("data-bs-original-title", "Copied!");
    tooltipBtn.show();
    e.trigger.setAttribute("data-bs-original-title", "Copy to clipboard");
    e.clearSelection();
  });
  clipboard.on("error", function (e) {
    var modifierKey = /mac/i.test(navigator.userAgent) ? "\u2318" : "Ctrl-";
    var fallbackMsg = "Press " + modifierKey + "C to copy";
    var tooltipBtn = bootstrap.Tooltip.getInstance(e.trigger);
    e.trigger.setAttribute("data-bs-original-title", fallbackMsg);
    tooltipBtn.show();
    e.trigger.setAttribute("data-bs-original-title", "Copy to clipboard");
  });
  anchors.options = {
    icon: "#",
  };
  anchors.add(
    ".bd-content > h2, .bd-content > h3, .bd-content > h4, .bd-content > h5"
  );
})();
