const { task, option, logger, argv, series } = require("just-task");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { promisify } = require("util");
const { exec } = require("child_process");

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

task("do-it", series("download", "extract-images"));
