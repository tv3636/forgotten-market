import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";
import stream from "stream";
import {
  getStyledTokenBuffer,
  GetStyledTokenBufferProps,
  stripExtension,
} from "../../../../lib/art/artGeneration";
import archiver from "archiver";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404);
  }
  console.log("req.query: ", req.query);

  let { tokenSlug, tokenId, width, trim } = req.query;
  let trimOption = !trim || trim === "0" ? false : true;
  let widthOption = !width ? 400 : parseInt(width as string);
  let isZip = false;

  console.log("tokenId: ", tokenId);
  if ((tokenId as string).match(/\.zip$/)) {
    isZip = true;
  }

  console.log("isZip: ", isZip);
  if (isZip) {
    // var bufferStream = new stream.PassThrough();
    // bufferStream.end(buffer);
    // return bufferStream.pipe(res);

    // Tell the browser that this is a zip file.
    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-disposition": "attachment; filename=myFile.zip",
    });

    const zip = archiver("zip");

    // Send the file to the page output.
    zip.pipe(res);

    // https://github.com/archiverjs/node-archiver
    // archive.append(fs.createReadStream(file1), { name: 'file1.txt' });

    // Create zip with some files. Two dynamic, one static. Put #2 in a sub folder.
    zip
      .append("Some text to go in file 1.", { name: "1.txt" })
      .append("Some text to go in file 2. I go in a folder!", {
        name: "somefolder/2.txt",
      })
      .file("staticFiles/3.txt", { name: "3.txt" })
      .finalize();
    return;
  } else {
    tokenId = stripExtension(tokenId as string);

    let genOptions: GetStyledTokenBufferProps = {
      tokenSlug: tokenSlug as string,
      tokenId: tokenId as string,
      width: widthOption,
      style: "default",
      trim: trimOption,
    };

    const buffer = await getStyledTokenBuffer(genOptions);

    var bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    return bufferStream.pipe(res);
  }
}
