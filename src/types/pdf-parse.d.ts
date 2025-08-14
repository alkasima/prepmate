// Type declaration for pdf-parse to silence TypeScript when the library has no types.
// If a community @types package becomes available you can replace this with the official types.

declare module 'pdf-parse' {
  interface PDFParseOptions {
    max?: number
    version?: number
  }

  interface PDFMeta {
    info?: any
    metadata?: any
    version?: string
    text?: string
  }

  function pdfParse(data: Buffer | Uint8Array | string, options?: PDFParseOptions): Promise<{
    numpages: number
    numrender: number
    info: any
    metadata: any
    version: string
    text: string
  }>;

  export = pdfParse
}
