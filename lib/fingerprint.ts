export function getBrowserFingerprint() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem("bollygit_fingerprint");
  if (existing) {
    return existing;
  }

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    window.screen.width,
    window.screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") 
      ? crypto.randomUUID() 
      : Math.random().toString(36).slice(2)
  ].join("|");

  const encoded = btoa(unescape(encodeURIComponent(fingerprint))).slice(0, 64);
  window.localStorage.setItem("bollygit_fingerprint", encoded);
  return encoded;
}
