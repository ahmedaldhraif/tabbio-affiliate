export async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Copy is unavailable in this browser.");
}

export function downloadText(
  filename: string,
  contents: string,
  type = "text/plain;charset=utf-8",
) {
  downloadBlob(filename, new Blob([contents], { type }));
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1_000);
}

export function downloadSvgElement(elementId: string, filename: string) {
  const svg = document.getElementById(elementId);
  if (!(svg instanceof SVGElement))
    throw new Error("The QR preview is not ready yet.");

  const source = new XMLSerializer().serializeToString(svg);
  downloadText(filename, source, "image/svg+xml;charset=utf-8");
}

export function readScenarioState() {
  if (typeof window === "undefined") return "default";
  return new URLSearchParams(window.location.search).get("state") ?? "default";
}
