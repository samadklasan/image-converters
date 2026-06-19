import { SitePageShell } from "@/components/site-page-shell";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { BmpToTiffConverter } from "@/components/tools/bmp-to-tiff/bmp-to-tiff-converter";
import { BmpToTiffExplainer } from "@/components/tools/bmp-to-tiff/bmp-to-tiff-explainer";
import { sniglet } from "@/lib/fonts";

export function BmpToTiffPage() {
  return (
    <SitePageShell mainClassName="flex-1">
      <section className="border-b border-brand/20 bg-white">
        <div className="editorial-shell py-8 sm:py-10 lg:py-12">
          <div className="mx-auto max-w-[1720px]">
            <ToolPageLayout>
              <div className="space-y-4">
                <div
                  id="bmp-to-tiff-converter"
                  className="hero-panel p-5 sm:p-6 lg:p-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="max-w-3xl">
                      <h1 className={`${sniglet.className} hero-heading text-[36px] font-[400] leading-[1] sm:text-[48px]`}>
                        Free BMP To TIFF Converter
                      </h1>
                      <p className="mt-3 max-w-2xl font-body text-[15px] leading-[1.5] text-white sm:text-[16px]">
                        Convert BMP images to TIFF for print-friendly output and high-detail workflows.
                      </p>
                    </div>
                  </div>
                </div>

                <BmpToTiffConverter />
                <BmpToTiffExplainer />
              </div>
            </ToolPageLayout>
          </div>
        </div>
      </section>
    </SitePageShell>
  );
}
