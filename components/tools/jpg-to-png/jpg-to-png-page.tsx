import { JpgToPngConverter } from "@/components/tools/jpg-to-png/jpg-to-png-converter";
import { JpgToPngExplainer } from "@/components/tools/jpg-to-png/jpg-to-png-explainer";

export function JpgToPngPage() {
  return (
    <section className="border-b border-brand/20 bg-white">
      <div className="editorial-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1720px]">
          <div className="space-y-4">
                <div
                  id="jpg-to-png-converter"
                  className="hero-panel p-5 sm:p-6 lg:p-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="max-w-3xl">
                      <h1 className="hero-heading text-[36px] font-[400] leading-[1] sm:text-[48px]">
                        Free JPG To PNG Converter
                      </h1>
                      <p className="mt-3 max-w-2xl font-body text-[15px] leading-[1.5] text-white sm:text-[16px]">
                        Turn JPG photos into PNG files when you want lossless exports, cleaner editing handoffs, or a format that fits design workflows better.
                      </p>
                    </div>
                  </div>
                </div>

                <JpgToPngConverter />
                <JpgToPngExplainer />
          </div>
        </div>
      </div>
    </section>
  );
}
