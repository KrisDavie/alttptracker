/**
 * Client/environment metadata captured alongside a state snapshot.
 *
 * Collects browser, OS, window/viewport and zoom information to help a developer
 * reproduce the exact conditions a bug was reported under. All fields are
 * best-effort: APIs that aren't available (or throw) are simply omitted.
 */

export interface ClientMetadata {
  /** Raw User-Agent string (always available). */
  userAgent: string;
  /** Best-effort browser name + version. */
  browser?: { name: string; version: string };
  /** Best-effort OS name + version. */
  os?: { name: string; version?: string };
  /** CPU architecture / bitness (UA Client Hints, Chromium only). */
  architecture?: string;
  bitness?: string;
  /** Device model (mostly mobile, UA Client Hints). */
  model?: string;
  /** Whether the UA reports a mobile device. */
  mobile?: boolean;
  /** UI language and full language preference list. */
  language?: string;
  languages?: string[];
  /** IANA timezone, e.g. "Europe/Berlin". */
  timezone?: string;
  /** Window / viewport dimensions and zoom signals. */
  window: {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
    /** Combined OS scaling × browser zoom. */
    devicePixelRatio: number;
    /** Pinch-zoom scale, when the VisualViewport API is available. */
    visualViewportScale?: number;
    /**
     * Rough browser page-zoom estimate as a percentage (100 = no zoom).
     * Derived from outerWidth/innerWidth, so it is unreliable when devtools are
     * docked or scrollbars are present — treat as a hint, not exact.
     */
    zoomPercentEstimate?: number;
  };
  /** Screen geometry. */
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    orientation?: string;
  };
  /** Logical CPU cores, when exposed. */
  hardwareConcurrency?: number;
  /** Approximate device memory in GB, when exposed (Chromium). */
  deviceMemory?: number;
  /** Active media-query preferences relevant to rendering. */
  preferences?: {
    colorScheme?: "light" | "dark";
    reducedMotion?: boolean;
    forcedColors?: boolean;
  };
}

interface UADataBrand {
  brand: string;
  version: string;
}

interface UAHighEntropyValues {
  platform?: string;
  platformVersion?: string;
  architecture?: string;
  bitness?: string;
  model?: string;
  uaFullVersion?: string;
  fullVersionList?: UADataBrand[];
}

interface NavigatorUAData {
  brands?: UADataBrand[];
  mobile?: boolean;
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<UAHighEntropyValues>;
}

/** Pick the most meaningful brand from a UA-CH brand list (skips Chromium / "Not.A/Brand"). */
function pickBrand(brands: UADataBrand[] | undefined): UADataBrand | undefined {
  if (!brands || brands.length === 0) return undefined;
  const real = brands.filter((b) => !/not.?a.?brand/i.test(b.brand));
  const branded = real.find((b) => b.brand !== "Chromium");
  return branded ?? real[0] ?? brands[0];
}

/** Map a Windows UA-CH platformVersion to a marketing name (11 vs 10). */
function windowsName(platformVersion?: string): string {
  const major = parseInt((platformVersion ?? "").split(".")[0] ?? "", 10);
  if (Number.isFinite(major) && major >= 13) return "Windows 11";
  if (Number.isFinite(major) && major > 0) return "Windows 10";
  return "Windows";
}

/** Fallback parser for browser name/version from a UA string (non-Chromium). */
function parseBrowserFromUA(ua: string): { name: string; version: string } | undefined {
  const patterns: Array<[string, RegExp]> = [
    ["Edge", /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ["Opera", /OPR\/([\d.]+)/],
    ["Firefox", /Firefox\/([\d.]+)/],
    ["Chrome", /Chrome\/([\d.]+)/],
    ["Safari", /Version\/([\d.]+).*Safari/],
  ];
  for (const [name, re] of patterns) {
    const m = ua.match(re);
    if (m) return { name, version: m[1] };
  }
  return undefined;
}

/** Fallback parser for OS name/version from a UA string. */
function parseOSFromUA(ua: string): { name: string; version?: string } | undefined {
  let m: RegExpMatchArray | null;
  if ((m = ua.match(/Windows NT ([\d.]+)/))) {
    const map: Record<string, string> = { "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7" };
    return { name: "Windows", version: map[m[1]] ?? m[1] };
  }
  if ((m = ua.match(/Mac OS X ([\d_]+)/))) return { name: "macOS", version: m[1].replace(/_/g, ".") };
  if ((m = ua.match(/Android ([\d.]+)/))) return { name: "Android", version: m[1] };
  if ((m = ua.match(/(?:iPhone|iPad); CPU(?: iPhone)? OS ([\d_]+)/))) return { name: "iOS", version: m[1].replace(/_/g, ".") };
  if (/Linux/.test(ua)) return { name: "Linux" };
  return undefined;
}

function safe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

/**
 * Collect best-effort client/environment metadata. Async because UA Client
 * Hints high-entropy values resolve via a Promise on Chromium browsers.
 */
export async function collectClientMetadata(): Promise<ClientMetadata> {
  const nav = navigator as Navigator & {
    userAgentData?: NavigatorUAData;
    deviceMemory?: number;
  };
  const ua = nav.userAgent;

  const meta: ClientMetadata = {
    userAgent: ua,
    language: nav.language,
    languages: nav.languages ? [...nav.languages] : undefined,
    timezone: safe(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
    mobile: nav.userAgentData?.mobile,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio,
      visualViewportScale: window.visualViewport?.scale,
      zoomPercentEstimate: window.innerWidth > 0 ? Math.round((window.outerWidth / window.innerWidth) * 100) : undefined,
    },
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      orientation: safe(() => screen.orientation?.type),
    },
    preferences: {
      colorScheme: safe(() => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")),
      reducedMotion: safe(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      forcedColors: safe(() => window.matchMedia("(forced-colors: active)").matches),
    },
  };

  // Prefer UA Client Hints (Chromium) for accurate browser/OS version data.
  const uaData = nav.userAgentData;
  if (uaData?.getHighEntropyValues) {
    const high = await safe(() => uaData.getHighEntropyValues!(["platform", "platformVersion", "architecture", "bitness", "model", "uaFullVersion", "fullVersionList"]));
    if (high) {
      const brand = pickBrand(high.fullVersionList) ?? pickBrand(uaData.brands);
      if (brand) meta.browser = { name: brand.brand, version: brand.version };
      if (high.platform) {
        meta.os = high.platform === "Windows" ? { name: windowsName(high.platformVersion), version: high.platformVersion } : { name: high.platform, version: high.platformVersion };
      }
      meta.architecture = high.architecture;
      meta.bitness = high.bitness;
      meta.model = high.model || undefined;
    }
  }

  // Fall back to UA-string parsing for anything UA-CH didn't provide.
  if (!meta.browser) meta.browser = parseBrowserFromUA(ua);
  if (!meta.os) meta.os = parseOSFromUA(ua);

  return meta;
}
