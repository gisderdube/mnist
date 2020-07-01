const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const request = require("request-promise");
const fs = require("fs");
const fse = require("fs-extra");
const sharp = require("sharp");
const server = express();

server.use(cors());

server.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

server.use(express.static(path.join(__dirname, "public", "app")));

server.get("/", (req, res) => {
  res.send("hello from the classifier");
});

server.post("/classify", async (req, res) => {
  try {
    fse.ensureDirSync(path.join(__dirname, "../tmp"));
    const tmpFilePath = path.join(
      __dirname,
      "../tmp",
      req.files.file.md5 + ".png"
    );
    fs.writeFileSync(tmpFilePath, req.files.file.data);
    const resizedTempFilePath = path.join(
      __dirname,
      "../tmp",
      req.files.file.md5 + "-28.png"
    );
    await sharp(tmpFilePath).resize(28).toFile(resizedTempFilePath);
    fs.unlinkSync(tmpFilePath);

    const result = await request(
      `http://localhost:5000/classify?filename=${
        resizedTempFilePath.split("/").reverse()[0]
      }`
    );
    res.send(result);
    fs.unlinkSync(resizedTempFilePath);
  } catch (err) {
    console.error(err);
    res.send({ error: true });
  }
});

server.use((req, res) => res.redirect("/"));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Web server listening at http://localhost:" + port);
});
