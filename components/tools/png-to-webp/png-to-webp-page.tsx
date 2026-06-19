import { PngToWebpConverter } from "@/components/tools/png-to-webp/png-to-webp-converter";
import { PngToWebpExplainer } from "@/components/tools/png-to-webp/png-to-webp-explainer";
import { sniglet } from "@/lib/fonts";

export function PngToWebpPage() {
  return (
    <section className="border-b border-brand/20 bg-white">
      <div className="editorial-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1720px]">
          <div className="space-y-4">
                <div
                  id="png-to-webp-converter"
                  className="hero-panel p-5 sm:p-6 lg:p-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="max-w-3xl">
                      <h1 className={`${sniglet.className} hero-heading text-[36px] font-[400] leading-[1] sm:text-[48px]`}>
                        Free PNG To WEBP Converter
                      </h1>
                      <p className="mt-3 max-w-2xl font-body text-[15px] leading-[1.5] text-white sm:text-[16px]">
                        Make PNG images smaller with WEBP for faster page loads while still keeping strong visual quality.
                      </p>
                    </div>
                  </div>
                </div>

                <PngToWebpConverter />
                <PngToWebpExplainer />
          </div>
        </div>
      </div>
    </section>
  );
}
