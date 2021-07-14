import Phaser from "phaser";

import WebFontLoader from "webfontloader";

// https://photonstorm.github.io/phaser3-docs/Phaser.Loader.File.html
export default class WebFontFile extends Phaser.Loader.File {
  fontsLoadedCount: number;
  fontNames: string[];
  service: any;

  /**
   * @param {Phaser.Loader.LoaderPlugin} loader
   * @param {string | string[]} fontNames
   * @param {string} [service]
   */
  constructor(loader: any, fontNames: string[], service = "google") {
    super(loader, {
      type: "webfont",
      key: fontNames.toString()
    });

    this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
    this.service = service;

    this.fontsLoadedCount = 0;
  }

  load() {
    const config: any = {
      fontactive: (familyName: string) => {
        this.checkLoadedFonts(familyName);
      },
      fontinactive: (familyName: string) => {
        this.checkLoadedFonts(familyName);
      }
    };

    switch (this.service) {
      case "google":
        config[this.service] = this.getGoogleConfig();
        break;

      case "adobe-edge":
        config["typekit"] = this.getAdobeEdgeConfig();
        break;

      default:
        throw new Error("Unsupported font service");
    }

    WebFontLoader.load(config);
  }

  getGoogleConfig() {
    return {
      families: this.fontNames
    };
  }

  getAdobeEdgeConfig() {
    return {
      id: this.fontNames.join(";"),
      api: "//use.edgefonts.net"
    };
  }

  checkLoadedFonts(familyName: string) {
    if (this.fontNames.indexOf(familyName) < 0) {
      return;
    }

    ++this.fontsLoadedCount;
    if (this.fontsLoadedCount >= this.fontNames.length) {
      this.loader.nextFile(this, true);
    }
  }
}
