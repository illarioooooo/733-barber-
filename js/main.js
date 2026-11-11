/* 733 Barber Shop — interactions (JavaScript vanilla) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Réservation Planity ----------
     Planity interdit l'affichage de ses pages dans une iframe
     (en-têtes X-Frame-Options / CSP frame-ancestors) : tous les boutons
     « Réserver » ouvrent donc la page Planity dans un nouvel onglet. */
  var PLANITY_URL = "https://www.planity.com/733-barber-shop-coiffeur-barbier-83500-la-seyne-sur-mer";
  document.querySelectorAll("[data-book]").forEach(function (a) {
    a.href = PLANITY_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Header : fond au scroll + bouton flottant ---------- */
  var header = document.getElementById("header");
  var fab = document.getElementById("fab");
  var hero = document.querySelector(".hero");
  var footer = document.querySelector(".footer");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    if (fab && hero) {
      var pastHero = y > hero.offsetHeight * 0.6;
      var nearFooter = footer && footer.getBoundingClientRect().top < window.innerHeight - 40;
      fab.classList.toggle("is-visible", pastHero && !nearFooter);
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Menu burger accessible ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
  }
  burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });
  // Garder le focus dans le menu ouvert (burger + liens)
  nav.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
    var links = nav.querySelectorAll("a");
    var last = links[links.length - 1];
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); burger.focus(); }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Lien actif dans le menu ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__list a"));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          var active = l.getAttribute("href") === "#" + entry.target.id;
          l.classList.toggle("is-active", active);
          if (active) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (l) {
      var s = document.querySelector(l.getAttribute("href"));
      if (s) spy.observe(s);
    });
  }

  /* ---------- Apparition au scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      // léger décalage pour les éléments d'une même grille
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
      var idx = Array.prototype.indexOf.call(siblings, el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx, 5) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---------- Horaires : jour actuel + statut ouvert/fermé (heure de Paris) ---------- */
  function parisNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], minutes: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var now = parisNow();
  var todayRow = document.querySelector('#hours tr[data-day="' + now.day + '"]');
  if (todayRow) todayRow.classList.add("is-today");

  var status = document.getElementById("status");
  if (status) {
    var OPEN = 9 * 60, CLOSE = 19 * 60;
    var isOpenDay = now.day >= 1 && now.day <= 6;
    var open = isOpenDay && now.minutes >= OPEN && now.minutes < CLOSE;
    var msg;
    if (open) {
      msg = "Ouvert maintenant · jusqu'à 19h";
    } else if (isOpenDay && now.minutes < OPEN) {
      msg = "Fermé · ouvre aujourd'hui à 9h";
    } else {
      msg = (now.day === 6 || now.day === 0) ? "Fermé · ouvre lundi à 9h" : "Fermé · ouvre demain à 9h";
    }
    status.textContent = msg;
    status.classList.add(open ? "is-open" : "is-closed");
  }

  /* ---------- Carrousel d'avis ---------- */
  var track = document.getElementById("reviews");
  if (track) {
    document.querySelectorAll(".carousel__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = track.querySelector(".review");
        var step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
        var dir = parseInt(btn.getAttribute("data-dir"), 10);
        var max = track.scrollWidth - track.clientWidth;
        var target = track.scrollLeft + dir * step;
        if (target > max + 4) target = 0;            // boucle vers le début
        else if (target < -4) target = max;          // boucle vers la fin
        track.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        document.querySelector('.carousel__btn[data-dir="' + (e.key === "ArrowRight" ? 1 : -1) + '"]').click();
      }
    });
  }

  /* ---------- Lightbox galerie ---------- */
  var box = document.getElementById("lightbox");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (box && items.length && typeof box.showModal === "function") {
    var boxImg = box.querySelector(".lightbox__img");
    var current = 0, opener = null;

    function show(i) {
      current = (i + items.length) % items.length;
      var a = items[current];
      boxImg.src = a.getAttribute("href");
      boxImg.alt = a.querySelector("img").alt;
    }
    items.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        opener = a;
        show(i);
        box.showModal();
        box.querySelector(".lightbox__close").focus();
      });
    });
    box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
    box.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  /* ---------- Année du copyright ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
