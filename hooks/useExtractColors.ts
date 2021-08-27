import { useEffect, useState } from "react";
import convert from "color-convert";
import { sortBy, toPairs } from "lodash";

const getImageData = function (imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", imageUrl, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      if (this.status == 200) {
        let uInt8Array = new Uint8Array(this.response);
        let i = uInt8Array.length;
        let binaryString = new Array(i);
        for (let i = 0; i < uInt8Array.length; i++) {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        let data = binaryString.join("");
        let base64 = window.btoa(data);
        resolve("data:image/png;base64," + base64);
      }
    };
    xhr.send();
  });
};

function extractBgColor(imagePixels: any, width: number, height: number) {
  //
  const pixels = imagePixels;
  const colorCounts: { [hex: string]: number } = {};

  // just read the top row, could pull from more borders if you want
  for (let i = 0, offset, r, g, b, a; i < width; i++) {
    offset = i * 4;
    r = pixels[offset + 0];
    g = pixels[offset + 1];
    b = pixels[offset + 2];
    a = pixels[offset + 3];
    const hexColor = convert.rgb.hex(r, g, b);
    colorCounts[hexColor] = colorCounts[hexColor] || 0;
    colorCounts[hexColor] = colorCounts[hexColor] + 1;
  }

  const mostFrequentPair = sortBy(
    toPairs(colorCounts),
    ([key, v]) => v
  ).reverse();
  const mostFrequentColor = mostFrequentPair[0][0];
  return "#" + mostFrequentColor;
}

export function useExtractColors(url?: string | null) {
  const [bgColor, setBgColor] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!url) return;
      //
      const imageData = await getImageData(url);
      const image: HTMLImageElement = document.createElement("img");
      image.addEventListener("load", function () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;
        const width = (canvas.width = image.naturalWidth);
        const height = (canvas.height = image.naturalHeight);
        context.drawImage(image, 0, 0, width, height);
        const imagePixels = context.getImageData(0, 0, width, height);
        const extractedBgColor = extractBgColor(
          imagePixels.data,
          width,
          height
        );
        setBgColor(extractedBgColor);
      });
      image.src = imageData;
    }
    run();
  }, [url]);

  return { bgColor };
}
