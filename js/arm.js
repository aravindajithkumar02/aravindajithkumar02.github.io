/* Live 2-link robot arm drawn like a technical drawing.
   It follows the cursor / finger using inverse kinematics (IK):
   given a target point, find the two joint angles that put the tool there.
   When nobody touches it, it traces a slow figure-eight on its own. */
(function () {
  "use strict";
  var stage = document.getElementById("arm-stage");
  var canvas = document.getElementById("arm-canvas");
  if (!stage || !canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var readA = document.getElementById("arm-t1");
  var readB = document.getElementById("arm-t2");
  var readT = document.getElementById("arm-xz");

  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var css = getComputedStyle(document.documentElement);
  var INK = css.getPropertyValue("--bp-ink").trim() || "#dceaf6";
  var DIM = css.getPropertyValue("--orange").trim() || "#e2711d";

  var W = 0, H = 0;
  var target = null;          // where the visitor points (null = idle)
  var idle = 0;               // seconds since last pointer movement
  var cur = { a: 1.0, b: -1.2 }; // current joint angles in radians
  var last = performance.now();

  function resize() {
    var r = stage.getBoundingClientRect();
    if (!r.width) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function point(e) {
    var r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  stage.addEventListener("pointermove", function (e) { target = point(e); idle = 0; });
  stage.addEventListener("pointerdown", function (e) { target = point(e); idle = 0; });
  stage.addEventListener("pointerleave", function () { target = null; });

  /* Inverse kinematics for two links of length L1 and L2.
     (bx, by) is the shoulder, (tx, ty) the target, both in screen pixels.
     Screen y grows downwards, so we flip it to get normal maths angles. */
  function ik(bx, by, tx, ty, L1, L2) {
    var dx = tx - bx, dy = by - ty;
    var d = Math.hypot(dx, dy);
    var max = L1 + L2 - 1, min = Math.abs(L1 - L2) + 1;
    if (d > max) { dx *= max / d; dy *= max / d; d = max; }   // out of reach: stretch towards it
    if (d < min) { dx *= min / d; dy *= min / d; d = min; }   // too close: stay at the inner limit
    // Law of cosines gives the elbow angle b
    var c = (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    var b = -Math.acos(Math.max(-1, Math.min(1, c)));          // minus = "elbow up"
    // Shoulder angle a: direction to the target, corrected by the elbow's offset
    var a = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(b), L1 + L2 * Math.cos(b));
    return { a: a, b: b };
  }

  // Drawing helpers --------------------------------------------------------
  function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); }

  // A link drawn as an outline: two parallel edges joined by the joint circles
  function link(x1, y1, x2, y2, half) {
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var nx = -Math.sin(ang) * half, ny = Math.cos(ang) * half;
    line(x1 + nx, y1 + ny, x2 + nx, y2 + ny);
    line(x1 - nx, y1 - ny, x2 - nx, y2 - ny);
    ctx.save(); ctx.setLineDash([6, 4]); ctx.globalAlpha = 0.45;
    line(x1, y1, x2, y2);                       // centre line, as on a drawing
    ctx.restore();
  }

  // Angle dimension: arc from angle `from` to `to` (maths angles) with a label
  function angleDim(cx, cy, r, from, to, label) {
    ctx.save();
    ctx.strokeStyle = DIM; ctx.fillStyle = DIM; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -from, -to, to > from);  // canvas angles run clockwise
    ctx.stroke();
    var mid = (from + to) / 2;
    ctx.font = "500 12px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, cx + Math.cos(mid) * (r + 18), cy - Math.sin(mid) * (r + 18));
    ctx.restore();
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now; idle += dt;

    if (W) {
      var bx = W * 0.36, by = H * 0.80;       // shoulder position
      var L1 = H * 0.36, L2 = H * 0.30;       // link lengths in pixels
      var m = 1.2 / (L1 + L2);                // pixels → "metres" so the readout reads like a real cell

      var t = target;
      if (!t || idle > 3) {                   // idle: slow figure-eight
        var k = reduced ? 0.9 : now / 1000;
        t = { x: bx + (L1 + L2) * 0.55 + Math.cos(k * 0.6) * W * 0.16,
              y: by - L1 * 0.85 + Math.sin(k * 1.2) * H * 0.13 };
      }
      var goal = ik(bx, by, t.x, t.y, L1, L2);
      var f = reduced ? 1 : 1 - Math.exp(-dt * 8);   // smooth approach, like a real drive
      cur.a += (goal.a - cur.a) * f;
      cur.b += (goal.b - cur.b) * f;

      // Forward kinematics: where the elbow and tool actually are
      var ex = bx + L1 * Math.cos(cur.a), ey = by - L1 * Math.sin(cur.a);
      var tx = ex + L2 * Math.cos(cur.a + cur.b), ty = ey - L2 * Math.sin(cur.a + cur.b);

      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round"; ctx.lineJoin = "round";

      // floor line and reach envelope
      ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
      line(W * 0.06, by + 34, W * 0.94, by + 34);
      ctx.setLineDash([3, 6]); ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.arc(bx, by, L1 + L2, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      // pedestal
      ctx.lineWidth = 1.6;
      ctx.strokeRect(bx - 34, by + 12, 68, 22);
      ctx.strokeRect(bx - 20, by, 40, 12);

      // links and joints
      link(bx, by, ex, ey, H * 0.03);
      link(ex, ey, tx, ty, H * 0.022);
      circle(bx, by, H * 0.042); circle(bx, by, H * 0.012);
      circle(ex, ey, H * 0.034); circle(ex, ey, H * 0.010);

      // tool (simple gripper, pointing down)
      line(tx, ty, tx, ty + 14);
      line(tx - 11, ty + 14, tx + 11, ty + 14);
      line(tx - 11, ty + 14, tx - 11, ty + 26);
      line(tx + 11, ty + 14, tx + 11, ty + 26);

      // dimensions: shoulder angle from horizontal, elbow angle between links
      ctx.strokeStyle = DIM; ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
      ctx.setLineDash([2, 4]);
      line(bx, by, bx + H * 0.16, by);
      line(ex, ey, ex + Math.cos(cur.a) * H * 0.12, ey - Math.sin(cur.a) * H * 0.12);
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      var degA = cur.a * 180 / Math.PI, degB = cur.b * 180 / Math.PI;
      angleDim(bx, by, H * 0.12, 0, cur.a, "θ1");
      angleDim(ex, ey, H * 0.09, cur.a, cur.a + cur.b, "θ2");

      // target cross
      ctx.strokeStyle = DIM; ctx.globalAlpha = 0.8;
      line(t.x - 7, t.y, t.x + 7, t.y); line(t.x, t.y - 7, t.x, t.y + 7);
      ctx.globalAlpha = 1;

      if (readA) readA.textContent = degA.toFixed(1) + "°";
      if (readB) readB.textContent = degB.toFixed(1) + "°";
      if (readT) readT.textContent = "x " + ((tx - bx) * m).toFixed(2) + "  z " + ((by - ty) * m).toFixed(2) + " m";
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
