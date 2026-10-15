/* Builds the project cards, the project detail view, earlier work and the
   gallery from data/projects.js. You normally never need to edit this file. */
(function () {
  "use strict";
  var data = window.SITE_DATA || { projects: [], earlierWork: [], gallery: [] };

  // Small helpers -----------------------------------------------------------
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function list(items, className) {
    var ul = el("ul", className);
    items.forEach(function (item) {
      if (item && typeof item === "object") {          // { label, text } → bold lead-in
        var li = el("li", "labelled");
        li.appendChild(el("strong", null, item.label));
        li.appendChild(document.createTextNode(" " + item.text));
        ul.appendChild(li);
      } else {
        ul.appendChild(el("li", null, item));
      }
    });
    return ul;
  }
  function statusText(p) {
    var s = p.status === "done" ? "Done" : "In progress";
    return p.progress ? s + " · " + p.progress : s;
  }

  // Project cards -------------------------------------------------------------
  var cardList = document.getElementById("project-list");
  data.projects.forEach(function (p) {
    var card = el("button", "card");
    card.type = "button";
    card.id = "project-" + p.id;
    card.setAttribute("aria-haspopup", "dialog");

    var cover = el("div", "cover");
    if (p.images && p.images.length) {
      var img = el("img");
      img.src = p.images[0].src;
      img.alt = p.images[0].alt || "";
      img.loading = "lazy";
      if (p.images[0].fit === "contain") cover.classList.add("contain");
      cover.appendChild(img);
    } else if (p.highlight) {
      var small = p.highlight.length > 18;
      cover.appendChild(el("span", "hl" + (small ? " small" : ""), p.highlight));
    }
    card.appendChild(cover);

    var body = el("div", "card-body");
    body.appendChild(el("span", "status " + p.status, statusText(p)));
    body.appendChild(el("h3", null, p.title));
    if (p.tagline) body.appendChild(el("p", "tagline", p.tagline));
    body.appendChild(el("span", "more", "Details →"));
    card.appendChild(body);

    card.addEventListener("click", function () { openProject(p.id, card); });
    cardList.appendChild(card);
  });

  // Project detail dialog ----------------------------------------------------
  var dialog = document.getElementById("project-dialog");
  var dialogBody = document.getElementById("dialog-body");
  var returnFocus = null;

  function buildDetail(p) {
    dialogBody.textContent = "";

    var head = el("div", "detail-head");
    [["Period", p.period], ["Status", null], ["Context", p.context]].forEach(function (cell) {
      var box = el("div");
      box.appendChild(el("span", "label", cell[0]));
      if (cell[1] === null) box.appendChild(el("span", "status " + p.status, statusText(p)));
      else box.appendChild(el("span", "val", cell[1]));
      head.appendChild(box);
    });
    var close = el("button", "close", "Close ✕");
    close.type = "button";
    close.addEventListener("click", function () { dialog.close(); });
    head.appendChild(close);
    dialogBody.appendChild(head);

    var title = el("h2", null, p.title);
    title.id = "dialog-title";
    dialogBody.appendChild(title);

    (p.images || []).forEach(function (im) {
      var fig = el("figure");
      var img = el("img");
      img.src = im.src; img.alt = im.alt || "";
      fig.appendChild(img);
      if (im.caption) fig.appendChild(el("figcaption", null, im.caption));
      dialogBody.appendChild(fig);
    });

    dialogBody.appendChild(el("p", null, p.summary));

    if (p.did && p.did.length) {
      var did = el("div");
      did.appendChild(el("h4", "label", p.didTitle || "My part"));
      did.appendChild(list(p.did));
      dialogBody.appendChild(did);
    }
    if (p.result) {
      var res = el("div", "result");
      res.appendChild(el("h4", "label", "Result"));
      res.appendChild(el("p", null, p.result));
      dialogBody.appendChild(res);
    }
    if (p.next && p.next.length) {
      var next = el("div");
      next.appendChild(el("h4", "label", "Next"));
      next.appendChild(list(p.next, "next"));
      dialogBody.appendChild(next);
    }
    if (p.tools && p.tools.length) dialogBody.appendChild(list(p.tools, "chips"));
    if (p.note) dialogBody.appendChild(el("p", "note", p.note));
    if (p.links && p.links.length) {
      var links = el("div", "links");
      p.links.forEach(function (l) {
        var a = el("a", null, l.label + " →");
        a.href = l.url; a.target = "_blank"; a.rel = "noopener";
        links.appendChild(a);
      });
      dialogBody.appendChild(links);
    }
  }

  function openProject(id, from) {
    var p = data.projects.filter(function (x) { return x.id === id; })[0];
    if (!p || !dialog) return;
    buildDetail(p);
    returnFocus = from || document.getElementById("project-" + id);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.scrollTop = 0;
  }

  if (dialog) {
    dialog.addEventListener("close", function () { if (returnFocus) returnFocus.focus(); });
    // click on the dark backdrop closes the dialog
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  }

  // Links like  #project-isaac-kuka  (from skills or timeline) open that project
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#project-"]');
    if (!a) return;
    var id = a.getAttribute("href").slice("#project-".length);
    var card = document.getElementById("project-" + id);
    if (!card) return;
    e.preventDefault();
    card.scrollIntoView({ block: "center" });
    openProject(id, card);
  });
  // ...and so does opening the page with such a link
  if (/^#project-/.test(location.hash)) openProject(location.hash.slice(9));

  // Earlier work ------------------------------------------------------------
  var earlierList = document.getElementById("earlier-list");
  (data.earlierWork || []).forEach(function (w) {
    var a = el("article");
    a.id = "work-" + w.id;
    a.appendChild(el("h4", null, w.title));
    a.appendChild(el("span", "meta", w.period + " · " + w.context));
    a.appendChild(el("p", null, w.summary));
    earlierList.appendChild(a);
  });

  // 3D-print gallery (section stays hidden while the list is empty) --------
  var gallery = data.gallery || [];
  if (gallery.length) {
    var g = document.getElementById("gallery-list");
    gallery.forEach(function (item) {
      var fig = el("figure");
      var img = el("img");
      img.src = item.src; img.alt = item.alt || ""; img.loading = "lazy";
      fig.appendChild(img);
      var cap = el("figcaption");
      cap.appendChild(el("strong", null, item.title));
      if (item.note) cap.appendChild(el("span", null, item.note));
      fig.appendChild(cap);
      g.appendChild(fig);
    });
    document.getElementById("prints").hidden = false;
  }

  // Copy-email button (falls back to selecting the text) --------------------
  var copyBtn = document.getElementById("copy-email");
  var email = document.getElementById("email");
  if (copyBtn && email) {
    copyBtn.addEventListener("click", function () {
      function done() {
        copyBtn.textContent = "Copied";
        setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800);
      }
      function select() {
        var range = document.createRange();
        range.selectNodeContents(email);
        var sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        copyBtn.textContent = "Selected";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email.textContent.trim()).then(done, select);
      } else { select(); }
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
