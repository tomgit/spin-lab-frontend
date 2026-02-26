declare module "fontfaceobserver" {
  export default class FontFaceObserver {
    constructor(family: string, options?: any);
    load(text?: string, timeout?: number): Promise<void>;
  }
}
