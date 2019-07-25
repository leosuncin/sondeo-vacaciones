const { task, option, logger, argv, series, parallel } = require("just-task");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { promisify } = require("util");
const { exec } = require("child_process");
const sharp = require("sharp");

const DEFAULT_REMOTE_PDF =
  "https://www.defensoria.gob.sv/wp-content/uploads/2015/04/QQ-Hoteles.pdf";
const execPromisified = promisify(exec);

option("remote-pdf", { default: DEFAULT_REMOTE_PDF, type: "string" });

task("download", async () => {
  const pdf = fs.createWriteStream(path.parse(argv().remotePdf).base);
  const download = url =>
    new Promise((resolve, reject) => {
      const request = https.get(url, resp => {
        resp.pipe(pdf);
        resp.on("end", () => {
          pdf.close();
          resolve();
        });
      });

      request.on("error", err => {
        fs.unlink(pdf);
        reject(err);
      });
    });

  try {
    await download(argv().remotePdf);
  } catch (e) {
    logger.error(e);
  }
});

task("extract-images", async () => {
  const pdf = path.parse(argv().remotePdf).base;
  const { stderr } = await execPromisified(
    `pdftoppm ${pdf} -png -rx 200 -ry 200 -f 3 -l 5 page`
  );

  if (stderr) {
    logger.error(stderr);
  }
});

function cropImage(input, geometry, output) {
  return async () =>
    sharp(input)
      .extract(geometry)
      .toFile(output);
}

task(
  "crop-image:min-price-la-libertad",
  cropImage(
    "page-3.png",
    { left: 268, top: 444, width: 1177, height: 1083 },
    "min-price-la-libertad.png"
  )
);

task(
  "crop-image:min-price-la-paz",
  cropImage(
    "page-3.png",
    { left: 268, top: 1564, width: 1177, height: 533 },
    "min-price-la-paz.png"
  )
);

task(
  "crop-image:max-price-la-libertad",
  cropImage(
    "page-4.png",
    { left: 219, top: 474, width: 1236, height: 1076 },
    "max-price-la-libertad.png"
  )
);

task(
  "crop-image:max-price-la-paz",
  cropImage(
    "page-4.png",
    { left: 219, top: 1584, width: 1236, height: 522 },
    "max-price-la-paz.png"
  )
);

task(
  "crop-images",
  parallel(
    "crop-image:min-price-la-libertad",
    "crop-image:min-price-la-paz",
    "crop-image:max-price-la-libertad",
    "crop-image:max-price-la-paz"
  )
);

task("do-it", series("download", "extract-images", "crop-images"));
