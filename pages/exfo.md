---
layout: page
title: EXFO Max Tester Simulation
subtitle: MaxTester 730B OTDR Training Emulator
permalink: /exfo/
---

<style>
/* Full-bleed technique — breaks iframe out of Beautiful Jekyll's content container */
.exfo-wrap {
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: 10px;
  margin-bottom: 0;
}

.exfo-frame {
  width: 100%;
  height: 88vh;
  min-height: 580px;
  border: none;
  display: block;
  background: #141824;
}

.exfo-notice {
  max-width: 900px;
  margin: 10px auto 0;
  font-size: 11px;
  color: #888;
  line-height: 1.8;
  padding: 0 20px;
}

.exfo-notice a {
  color: #aaa;
}
</style>

<div class="exfo-wrap">
  <iframe
    class="exfo-frame"
    src="/exfo/emulator.html"
    sandbox="allow-scripts allow-same-origin"
    loading="lazy"
    title="EXFO MaxTester 730B OTDR Training Emulator">
    <p>Your browser does not support iframes.
    <a href="/exfo/emulator.html">Open the emulator directly</a>.</p>
  </iframe>
</div>

<p class="exfo-notice">
  EXFO® and MaxTester® are registered trademarks of EXFO Inc., Quebec, Canada.
  This is an unofficial educational training simulator with no affiliation to EXFO Inc.
  No laser output. No user data collected.
  Source: <a href="https://github.com/3rc0/3rc0.github.io">github.com/3rc0/3rc0.github.io</a>
</p>
