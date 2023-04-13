import fs from "fs";
import downloadFile from "download";
import imageType from "image-type";

import sizeOf from "image-size";

export default async function downloadImage(url: string, dir: string, filename: string) {
    console.log(`Downloading ${url}`);
    const data = await downloadFile(url);
    if (!data) {
        throw new Error("Failed to download image " + url);
    }
    const ext = imageType(data).ext;

    fs.writeFileSync(`${dir}/${filename}.${ext}`, data);
    const dimensions = sizeOf(`${dir}/${filename}.${ext}`);

    console.log(`Successfully downloaded ${dir}/${filename}.${ext}`);

    return {
        path: `${filename}.${ext}`,
        width: dimensions.width,
        height: dimensions.height,
    }
}