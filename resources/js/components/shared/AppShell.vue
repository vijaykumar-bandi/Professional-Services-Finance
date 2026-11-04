<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <div class="app-shell">
    <header class="topbar">
      <strong>FirmLedger</strong>
      <span class="environment">Local development</span>
    </header>
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <div class="sr-only" aria-live="polite" aria-atomic="true" />
  </div>
</template>
