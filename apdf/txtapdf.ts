
import { readLines, PDFDocument, PageSizes, StandardFonts, path, myMod, parse } from "./deps.ts";

async function textFileToPdf(filename: string, outputdir: string, param?: any) {

  if (!param) {
    param = myMod.loadConfigFrom("./config.json").default;
    console.log(param);
  }
  const pdfDoc = await PDFDocument.create();
  //
  pdfDoc.setCreator('App desarrollada por José R. Ferreyra');
  pdfDoc.setAuthor("Dirección general de sistemas de hacienda de la provincia de Tucumán");
  pdfDoc.setSubject("Generacion de pdf desde sistemas");
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setTitle(path.basename(filename).replace(path.posix.extname(filename), ''));
  //
  const fontDoc = await pdfDoc.embedFont(StandardFonts.Courier);
  const pageSize: [number, number] = [param.pageSize.width, param.pageSize.heigth];

  try {
    let fileReader = await Deno.open(path.join(filename));

    let page = pdfDoc.addPage(pageSize);

    let countLines = 0;
    let countPag = 0;
    let dy = pageSize[1];

    for await (let line of readLines(fileReader)) {
      page.drawText(line, { size: param.fontSize, x: param.x, y: dy, font: fontDoc });

      dy -= param.dy;

      if (line.includes("\f")) {
        countPag++;
        page = pdfDoc.addPage(pageSize);
        dy = pageSize[1];
      }
      countLines++;
    }

    pdfDoc.removePage(countPag);
    const pdfBytes = await pdfDoc.save();
    const pathfileoutput = path.join(outputdir, path.basename(filename).replace(path.posix.extname(filename), '.pdf'));
    await Deno.writeFile(pathfileoutput, pdfBytes);
    console.log("Archivo", filename, "\tLineas: ", countLines, "\tPáginas", countPag);

  } catch (error) {
    console.log("Modifique el archivo ", filename, " a juego de caracteres UTF-8 ");
  }

}

async function main() {

  //const param = myMod.loadConfigFrom("./config.json").default;


  try {
    if (Deno.args[0]) {
      let inputdir = Deno.args[0];
      Deno.readDirSync(inputdir);

      const tempDir = 'output';

      if (!myMod.exists(tempDir)) {
        Deno.mkdirSync(tempDir);
      }

      const tempDirName0 = Deno.makeTempDirSync({ dir: tempDir });

      for await (const dirEntry of Deno.readDir(inputdir)) {
        if (dirEntry.isFile) {
          console.log(dirEntry.name);
          textFileToPdf( path.join(inputdir, dirEntry.name), tempDirName0);
        }
      }

    }
  } catch (error) {
    console.log("No se puede encontrar la ruta del directorio especificado.");
  }

  //if (param) {


  /*
    
    for (let i = 0; i < Deno.args.length; i++) {
      const filename = Deno.args[i];
      if (myMod.exists(filename)) {
        //const pathfileoutput = path.join(tempDirName0, path.basename(filename).replace(path.posix.extname(filename), '.pdf'));
        textFileToPdf(filename, tempDirName0);
      }
    }
    */

  //}

  //console.log("Archivos generados en la carpeta: ", tempDirName0);

}

main();
