import { GifToTiffConverter } from "@/components/tools/gif-to-tiff/gif-to-tiff-converter";
import { GifToTiffExplainer } from "@/components/tools/gif-to-tiff/gif-to-tiff-explainer";
import { sniglet } from "@/lib/fonts";

export function GifToTiffPage() {
  return (
    <section className="border-b border-brand/20 bg-white">
      <div className="editorial-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1720px]">
          <div className="space-y-4">
                <div
                  id="gif-to-tiff-converter"
                  className="hero-panel p-5 sm:p-6 lg:p-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="max-w-3xl">
                      <h1 className={`${sniglet.className} hero-heading text-[36px] font-[400] leading-[1] sm:text-[48px]`}>
                        Free GIF To TIFF Converter
                      </h1>
                      <p className="mt-3 max-w-2xl font-body text-[15px] leading-[1.5] text-white sm:text-[16px]">
                        Convert GIF images to TIFF for print-friendly output and high-detail workflows.
                      </p>
                    </div>
                  </div>
                </div>

                <GifToTiffConverter />
                <GifToTiffExplainer />
          </div>
        </div>
      </div>
    </section>
  );
}
