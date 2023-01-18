module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/grafit/" : "/",
  pwa: {
    workboxPluginMode: "GenerateSW",
    name: "Grafit",
    themeColor: "#ffcc00ff",
    msTileColor: "#ffcc00ff",
    iconPaths: {
      faviconSVG: "img/icons/icon.svg",
      favicon32: "img/icons/32.png",
      favicon16: "img/icons/16.png",
      appleTouchIcon: "img/icons/152.png",
      maskIcon: "img/icons/icon.svg",
      msTileImage: "img/icons/144.png",
    },
    manifestOptions: {
      lang: "PL",
      categories: ["productivity", "work", "job", "planning"],
      display: "fullscreen",
      description: "An application supporting the planning of shift schedules",
      icons: [
        {
          src: "./img/icons/icon.svg",
          type: "image/svg+xml",
          sizes: "48x48",
        },
        {
          src: "./img/icons/16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          src: "./img/icons/20.png",
          sizes: "20x20",
          type: "image/png",
        },
        {
          src: "./img/icons/29.png",
          sizes: "29x29",
          type: "image/png",
        },
        {
          src: "./img/icons/32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          src: "./img/icons/40.png",
          sizes: "40x40",
          type: "image/png",
        },
        {
          src: "./img/icons/48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "./img/icons/50.png",
          sizes: "50x50",
          type: "image/png",
        },
        {
          src: "./img/icons/57.png",
          sizes: "57x57",
          type: "image/png",
        },
        {
          src: "./img/icons/58.png",
          sizes: "58x58",
          type: "image/png",
        },
        {
          src: "./img/icons/60.png",
          sizes: "60x60",
          type: "image/png",
        },
        {
          src: "./img/icons/64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "./img/icons/72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "./img/icons/76.png",
          sizes: "76x76",
          type: "image/png",
        },
        {
          src: "./img/icons/80.png",
          sizes: "80x80",
          type: "image/png",
        },
        {
          src: "./img/icons/87.png",
          sizes: "87x87",
          type: "image/png",
        },
        {
          src: "./img/icons/96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "./img/icons/100.png",
          sizes: "100x100",
          type: "image/png",
        },
        {
          src: "./img/icons/114.png",
          sizes: "114x114",
          type: "image/png",
        },
        {
          src: "./img/icons/120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "./img/icons/128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "./img/icons/144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "./img/icons/152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "./img/icons/167.png",
          sizes: "167x167",
          type: "image/png",
        },
        {
          src: "./img/icons/180.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "./img/icons/192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "./img/icons/512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "./img/icons/1024.png",
          sizes: "1024x1024",
          type: "image/png",
        },
      ],
    },
  },
};
