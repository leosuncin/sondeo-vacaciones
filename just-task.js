const { task, option, logger, argv, series } = require("just-task");
const fs = require("fs");
const path = require("path");
const https = require("https");

const DEFAULT_REMOTE_PDF =
  "https://www.defensoria.gob.sv/wp-content/uploads/2015/04/QQ-Hoteles.pdf";

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
