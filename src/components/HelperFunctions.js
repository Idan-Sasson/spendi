import { icons } from "./constants";
// import { useLocalStorage } from "./useLocalStorage";


export function setAlpha(rgba, newAlpha) {
  // Remove the 'rgba(' prefix and ')' suffix
  const values = rgba.slice(5, -1).split(',').map(v => v.trim());

  // If there are only 3 values (i.e., "rgb(...)"), push alpha
  if (values.length === 3) {
    values.push(newAlpha);
  } else {
    values[3] = newAlpha;
  }

  return `rgba(${values.join(', ')})`;
}

export async function ConvertCurrencies(amount, baseCurrency, endCurrency) {  // BaseCurrency - Expense's currency, endCurrency - Display currency
  // 15$ - 15*3.5
  const reqUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`;
  const response = await fetch(reqUrl);
  const data = await response.json();
  const rate = data[baseCurrency][endCurrency];
  return amount * rate;
}

export function setIconColor(src, rgba) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = data.slice(i, i + 4);

        if (r + g + b < 100 && a > 0) {
          data[i] = rgba[0];     // Red
          data[i + 1] = rgba[1]; // Green
          data[i + 2] = rgba[2]; // Blue
          if (rgba.length === 4) {
            data[i + 3] = rgba[3]; // Set new Alpha if provided
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };

    img.onerror = reject;
  });
}

export function parseRgbaString(rgbaStr) {
  const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
  if (!match) return [0, 0, 0, 255]; // fallback to black

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255;

  return [r, g, b, a];
}
// Gets the icon from localstorage if exists, if not then add to localStorage

export async function getCachedIcon(iconKey, ColorStr, cachedIcons, setCachedIcons) {
  // const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", {});
  const cacheKey = `${iconKey}-${ColorStr}`
  const cached = cachedIcons[cacheKey];
  // console.log(cached);
  if (cached) {
    // console.log("CACHI CACHI");
    return cached;
  }
  // console.log("No cachi cachi", cacheKey);
  // console.log(cacheKey);
  const iconRgba = parseRgbaString(ColorStr);
  const iconSrc = icons[iconKey];
  const dataUrl = await setIconColor(iconSrc, iconRgba);
  setCachedIcons({ ...cachedIcons, [cacheKey]: dataUrl })
  return dataUrl;
} 