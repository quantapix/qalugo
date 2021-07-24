;(function () {
  "use strict"
  // Tooltip and popover demos
  document.querySelectorAll(".tooltip-demo").forEach(function (tooltip) {
    new bootstrap.Tooltip(tooltip, {
      selector: '[data-bs-toggle="tooltip"]',
    })
  })
  document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(function (popover) {
      new bootstrap.Popover(popover)
    })
  var toastPlacement = document.getElementById("toastPlacement")
  if (toastPlacement) {
    document
      .getElementById("selectToastPlacement")
      .addEventListener("change", function () {
        if (!toastPlacement.dataset.originalClass) {
          toastPlacement.dataset.originalClass = toastPlacement.className
        }
        toastPlacement.className =
          toastPlacement.dataset.originalClass + " " + this.value
      })
  }
  document
    .querySelectorAll(".qal-example .toast")
    .forEach(function (toastNode) {
      var toast = new bootstrap.Toast(toastNode, {
        autohide: false,
      })
      toast.show()
    })
  var toastTrigger = document.getElementById("liveToastBtn")
  var toastLiveExample = document.getElementById("liveToast")
  if (toastTrigger) {
    toastTrigger.addEventListener("click", function () {
      var toast = new bootstrap.Toast(toastLiveExample)
      toast.show()
    })
  }
  var alertPlaceholder = document.getElementById("liveAlertPlaceholder")
  var alertTrigger = document.getElementById("liveAlertBtn")
  function alert(message, type) {
    var wrapper = document.createElement("div")
    wrapper.innerHTML =
      '<div class="alert alert-' +
      type +
      ' alert-dismissible" role="alert">' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    alertPlaceholder.append(wrapper)
  }
  if (alertTrigger) {
    alertTrigger.addEventListener("click", function () {
      alert("Nice, you triggered this alert message!", "success")
    })
  }
  // Demos within modals
  document.querySelectorAll(".tooltip-test").forEach(function (tooltip) {
    new bootstrap.Tooltip(tooltip)
  })
  document.querySelectorAll(".popover-test").forEach(function (popover) {
    new bootstrap.Popover(popover)
  })
  // Indeterminate checkbox example
  document
    .querySelectorAll('.qal-example-indeterminate [type="checkbox"]')
    .forEach(function (checkbox) {
      checkbox.indeterminate = true
    })
  // Disable empty links in docs examples
  document.querySelectorAll('.qal-content [href="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault()
    })
  })
  // Modal relatedTarget demo
  var exampleModal = document.getElementById("exampleModal")
  if (exampleModal) {
    exampleModal.addEventListener("show.bs.modal", function (event) {
      // Button that triggered the modal
      var button = event.relatedTarget
      // Extract info from data-bs-* attributes
      var recipient = button.getAttribute("data-bs-whatever")
      // Update the modal's content.
      var modalTitle = exampleModal.querySelector(".modal-title")
      var modalBodyInput = exampleModal.querySelector(".modal-body input")
      modalTitle.textContent = "New message to " + recipient
      modalBodyInput.value = recipient
    })
  }
  // Activate animated progress bar
  var btnToggleAnimatedProgress = document.getElementById(
    "btnToggleAnimatedProgress"
  )
  if (btnToggleAnimatedProgress) {
    btnToggleAnimatedProgress.addEventListener("click", function () {
      btnToggleAnimatedProgress.parentNode
        .querySelector(".progress-bar-striped")
        .classList.toggle("progress-bar-animated")
    })
  }
  // Insert copy to clipboard button before .highlight
  var btnHtml =
    '<div class="qal-clipboard"><button type="button" class="btn-clipboard" title="Copy to clipboard">Copy</button></div>'
  document.querySelectorAll("div.highlight").forEach(function (element) {
    element.insertAdjacentHTML("beforebegin", btnHtml)
  })
  document.querySelectorAll(".btn-clipboard").forEach(function (btn) {
    var tooltipBtn = new bootstrap.Tooltip(btn)
    btn.addEventListener("mouseleave", function () {
      // Explicitly hide tooltip, since after clicking it remains
      // focused (as it's a button), so tooltip would otherwise
      // remain visible until focus is moved away
      tooltipBtn.hide()
    })
  })
  var clipboard = new ClipboardJS(".btn-clipboard", {
    target: function (trigger) {
      return trigger.parentNode.nextElementSibling
    },
  })
  clipboard.on("success", function (e) {
    var tooltipBtn = bootstrap.Tooltip.getInstance(e.trigger)
    e.trigger.setAttribute("data-bs-original-title", "Copied!")
    tooltipBtn.show()
    e.trigger.setAttribute("data-bs-original-title", "Copy to clipboard")
    e.clearSelection()
  })
  clipboard.on("error", function (e) {
    var modifierKey = /mac/i.test(navigator.userAgent) ? "\u2318" : "Ctrl-"
    var fallbackMsg = "Press " + modifierKey + "C to copy"
    var tooltipBtn = bootstrap.Tooltip.getInstance(e.trigger)
    e.trigger.setAttribute("data-bs-original-title", fallbackMsg)
    tooltipBtn.show()
    e.trigger.setAttribute("data-bs-original-title", "Copy to clipboard")
  })
  anchors.options = {
    icon: "#",
  }
  anchors.add(
    ".qal-content > h2, .qal-content > h3, .qal-content > h4, .qal-content > h5"
  )
})()
