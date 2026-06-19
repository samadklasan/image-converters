import { BmpToWebpConverter } from "@/components/tools/bmp-to-webp/bmp-to-webp-converter";
import { BmpToWebpExplainer } from "@/components/tools/bmp-to-webp/bmp-to-webp-explainer";
import { sniglet } from "@/lib/fonts";

export function BmpToWebpPage() {
  return (
    <section className="border-b border-brand/20 bg-white">
      <div className="editorial-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1720px]">
          <div className="space-y-4">
                <div
                  id="bmp-to-webp-converter"
                  className="hero-panel p-5 sm:p-6 lg:p-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="max-w-3xl">
                      <h1 className={`${sniglet.className} hero-heading text-[36px] font-[400] leading-[1] sm:text-[48px]`}>
                        Free BMP To WEBP Converter
                      </h1>
                      <p className="mt-3 max-w-2xl font-body text-[15px] leading-[1.5] text-white sm:text-[16px]">
                        Convert BMP images to WEBP for modern web delivery and lighter page assets.
                      </p>
                    </div>
                  </div>
                </div>

                <BmpToWebpConverter />
                <BmpToWebpExplainer />
          </div>
        </div>
      </div>
    </section>
  );
}
