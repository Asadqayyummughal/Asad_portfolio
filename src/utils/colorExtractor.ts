/**
 * Extracts the dominant color palette from an image and applies it as CSS variables.
 * When the developer.png image changes, the entire site's color scheme adapts automatically.
 */

interface ExtractedPalette {
  primary: string;       // Dominant vibrant color (replaces --coral)
  primaryDark: string;   // Darker shade
  primaryLight: string;  // Lighter shade
  accent: string;        // Secondary accent color
  dark: string;          // Darkest sampled color
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

interface ColorBucket {
  r: number;
  g: number;
  b: number;
  count: number;
}

function quantizeColors(imageData: ImageData, bucketCount: number = 8): ColorBucket[] {
  const data = imageData.data;
  const buckets: Map<string, ColorBucket> = new Map();
  
  // Quantize each pixel to reduce color space
  const step = 32; // Quantization step
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / step) * step;
    const g = Math.round(data[i + 1] / step) * step;
    const b = Math.round(data[i + 2] / step) * step;
    const a = data[i + 3];
    
    if (a < 128) continue; // Skip transparent pixels
    
    const key = `${r},${g},${b}`;
    if (buckets.has(key)) {
      buckets.get(key)!.count++;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }
  
  return Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, bucketCount);
}

function extractPalette(imageData: ImageData): ExtractedPalette {
  const colors = quantizeColors(imageData, 20);
  
  // Filter out near-white, near-black, and low-saturation colors for the "primary" pick
  const vibrantColors = colors.filter(c => {
    const [, s, l] = rgbToHsl(c.r, c.g, c.b);
    return s > 20 && l > 15 && l < 85;
  });
  
  // Pick the most vibrant color with decent saturation as primary
  const primaryBucket = vibrantColors.sort((a, b) => {
    const [, sa, la] = rgbToHsl(a.r, a.g, a.b);
    const [, sb, lb] = rgbToHsl(b.r, b.g, b.b);
    // Score = saturation * count, prefer mid-lightness
    const scoreA = sa * a.count * (1 - Math.abs(la - 50) / 50);
    const scoreB = sb * b.count * (1 - Math.abs(lb - 50) / 50);
    return scoreB - scoreA;
  })[0] || colors[0] || { r: 232, g: 83, b: 74 }; // fallback to coral
  
  const [h, s, l] = rgbToHsl(primaryBucket.r, primaryBucket.g, primaryBucket.b);
  
  // Generate dark and light variants
  const [dr, dg, db] = hslToRgb(h, Math.min(s + 10, 100), Math.max(l - 12, 15));
  const [lr, lg, lb] = hslToRgb(h, Math.min(s + 5, 100), Math.min(l + 15, 80));
  
  // Pick a secondary accent — different hue if possible
  const accentBucket = vibrantColors.find(c => {
    const [ch] = rgbToHsl(c.r, c.g, c.b);
    return Math.abs(ch - h) > 30; // At least 30° hue difference
  }) || vibrantColors[1] || primaryBucket;
  
  // Pick darkest color for backgrounds
  const darkBucket = colors.sort((a, b) => {
    const [, , la] = rgbToHsl(a.r, a.g, a.b);
    const [, , lb] = rgbToHsl(b.r, b.g, b.b);
    return la - lb;
  })[0] || { r: 26, g: 26, b: 26 };
  
  return {
    primary: rgbToHex(primaryBucket.r, primaryBucket.g, primaryBucket.b),
    primaryDark: rgbToHex(dr, dg, db),
    primaryLight: rgbToHex(lr, lg, lb),
    accent: rgbToHex(accentBucket.r, accentBucket.g, accentBucket.b),
    dark: rgbToHex(darkBucket.r, darkBucket.g, darkBucket.b),
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function applyPaletteToCSS(palette: ExtractedPalette) {
  const root = document.documentElement;
  root.style.setProperty('--coral', palette.primary);
  root.style.setProperty('--coral-dark', palette.primaryDark);
  root.style.setProperty('--coral-light', palette.primaryLight);

  // Update rgba-based uses too
  root.style.setProperty('--coral-7', hexToRgba(palette.primary, 0.07));
  root.style.setProperty('--coral-12', hexToRgba(palette.primary, 0.12));
  root.style.setProperty('--coral-20', hexToRgba(palette.primary, 0.2));
  root.style.setProperty('--coral-25', hexToRgba(palette.primary, 0.25));
  root.style.setProperty('--coral-85', hexToRgba(palette.primary, 0.85));
}

export function extractColorsFromImage(imgSrc: string): Promise<ExtractedPalette> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Downsample for performance
      const maxDim = 100;
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject('Canvas context failed'); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const palette = extractPalette(imageData);
      resolve(palette);
    };
    img.onerror = () => reject('Image load failed');
    img.src = imgSrc;
  });
}
