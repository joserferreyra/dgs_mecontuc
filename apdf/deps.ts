/**
 * deps.ts
 *
 * This module re-exports the required methods from the dependant remote Ramda module.
 **/

export {
    readLines
} from "https://deno.land/std@0.85.0/io/mod.ts";

export {
    PDFDocument, PageSizes, StandardFonts
} from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';

export * as path from "https://deno.land/std@0.85.0/path/mod.ts";

export { parse } from "https://deno.land/std@0.86.0/flags/mod.ts";

export * as myMod from "./myModule.ts";