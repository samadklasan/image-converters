const usageSteps = [
  {
    title: "Upload your PNG images",
    description:
      "Add one PNG or a batch of PNG files from your device.",
  },
  {
    title: "Convert to AVIF",
    description:
      "Click Convert to AVIF and let the tool process each image.",
  },
  {
    title: "Download finished AVIFs",
    description:
      "Download each finished file, or save the whole batch at once.",
  },
] as const;

const faqs = [
  {
    question: "Is this PNG to AVIF converter free?",
    answer:
      "Yes. You can queue PNG images, convert them into AVIF files here, and download the finished results without paying.",
  },
  {
    question: "Can I drag and drop files here?",
    answer:
      "Yes. You can drop PNG images straight into the upload area or add them with the upload button if you prefer browsing manually.",
  },
  {
    question: "What kind of files can I upload?",
    answer:
      "Only PNG images are supported in this converter.",
  },
  {
    question: "What is the maximum file size?",
    answer:
      "You can upload PNG files up to 50 MB each in this converter.",
  },
  {
    question: "Why would I convert PNG to AVIF?",
    answer:
      "AVIF can reduce image weight significantly compared with PNG, which is useful when you want faster page delivery with modern image formats.",
  },
  {
    question: "Will the converted AVIF keep transparency?",
    answer:
      "Yes. Transparent areas in PNG images can stay transparent because AVIF supports alpha channels.",
  },
  {
    question: "Is AVIF good for websites and apps?",
    answer:
      "Yes. AVIF is widely used for modern web delivery because it is built for efficient compression and smaller image payloads.",
  },
  {
    question: "What kind of PNG files work best with this converter?",
    answer:
      "UI exports, product graphics, design mock assets, screenshots, and transparent web visuals are all strong candidates for PNG to AVIF conversion.",
  },
  {
    question: "What happens after I click Convert to AVIF?",
    answer:
      "The tool works through the queue one file at a time and unlocks each AVIF download as soon as that specific conversion completes.",
  },
  {
    question: "How does batch processing work?",
    answer:
      "You can run up to 20 PNG images in a single batch. If you have more than that, finish the current queue, save the results, clear it, and begin the next set.",
  },
  {
    question: "Do you store my PNG or AVIF images?",
    answer:
      "No. The conversion runs locally in your browser session, and your PNG or AVIF images are not stored on our servers.",
  },
  {
    question: "When should I keep PNG instead of converting to AVIF?",
    answer:
      "If your workflow depends on older software, legacy platforms, or tools that still expect PNG, keeping the original files may be the safer option.",
  },
  {
    question: "Can I download converted files before the whole batch finishes?",
    answer:
      "Yes. Each finished item gets its own Save AVIF button right away, even while the rest of the batch is still being processed.",
  },
] as const;

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 text-black/40 transition-transform duration-200 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function PngToAvifExplainer() {
  return (
    <div className="max-w-5xl space-y-6 bg-white py-2 sm:py-3">
      <section>
        <details className="group" open>
          <summary className="flex w-full cursor-pointer list-none items-start justify-between gap-3 py-1">
            <h2 className="font-headline text-[18px] font-black leading-none text-black sm:text-[20px]">
              How It Works
            </h2>
            <ChevronIcon className="group-open:rotate-180" />
          </summary>

          <div className="mt-4 space-y-5">
            {usageSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="ui-step-circle flex h-8 w-8 shrink-0 items-center justify-center font-headline text-[13px] font-black">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="font-body text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] text-black sm:text-[16px]">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-3xl font-body text-[13px] leading-[1.45] text-black/65 sm:text-[14px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>

      <section className="pt-1">
        <h2 className="font-headline text-[18px] font-black leading-none text-black sm:text-[20px]">
          Frequently Asked Questions
        </h2>

        <div className="mt-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-black/8 py-3"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="max-w-3xl font-body text-[14px] font-semibold leading-[1.35] text-black sm:text-[15px]">
                  {faq.question}
                </span>
                <ChevronIcon className="group-open:rotate-180" />
              </summary>
              <p className="mt-2 max-w-3xl pr-6 font-body text-[13px] leading-[1.5] text-black/65 sm:text-[14px]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
