import { JpgToAvifConverter } from "@/components/tools/jpg-to-avif/jpg-to-avif-converter";
import { JpgToAvifExplainer } from "@/components/tools/jpg-to-avif/jpg-to-avif-explainer";

export function JpgToAvifPage() {
  return (
    <section className="border-b border-brand/20 bg-white">
      <div className="editorial-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1720px]">
          <div className="space-y-4">
                <div
                  id="jpg-to-avif-converter"
                  className="hero-panel p-5 sm:p-6 lg:p-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="max-w-3xl">
                      <h1 className="hero-heading text-[36px] font-[400] leading-[1] sm:text-[48px]">
                        Free JPG To AVIF Converter
                      </h1>
                      <p className="mt-3 max-w-2xl font-body text-[15px] leading-[1.5] text-white sm:text-[16px]">
                        Turn JPG images into AVIF files for smaller, modern image delivery without rebuilding your pictures by hand.
                      </p>
                    </div>
                  </div>
                </div>

                <JpgToAvifConverter />
                <JpgToAvifExplainer />
          </div>
        </div>
      </div>
    </section>
  );
}
