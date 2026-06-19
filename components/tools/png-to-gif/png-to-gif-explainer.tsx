const usageSteps = [
  {
    title: "Upload PNG images",
    description:
      "Add one PNG or a batch of PNG files from your device.",
  },
  {
    title: "Convert to GIF",
    description:
      "Click Convert to GIF and let the tool process each image.",
  },
  {
    title: "Download finished GIFs",
    description:
      "Download each finished file, or save the whole batch at once.",
  },
] as const;

const faqs = [
  {
    question: "Is this PNG to GIF converter free?",
    answer:
      "Yes. You can convert PNG files here and download the results for free.",
  },
  {
    question: "Can I drag and drop PNG files into the converter?",
    answer:
      "Yes. Drag PNG files into the upload area or pick them from your device.",
  },
  {
    question: "What kind of files can I upload?",
    answer:
      "This converter accepts PNG images only.",
  },
  {
    question: "What is the maximum file size?",
    answer:
      "You can upload PNG files up to 50 MB each in this converter.",
  },
  {
    question: "Why would I convert PNG to GIF?",
    answer:
      "GIF can be useful when you need a simple format that works in older apps and platforms.",
  },
  {
    question: "What happens to transparent PNG backgrounds in GIF?",
    answer:
      "GIF has limited transparency, so the result may not look as clean as the original PNG.",
  },
  {
    question: "Why can a GIF look less detailed than the original PNG?",
    answer:
      "GIF uses fewer colors, so gradients and fine details can look flatter.",
  },
  {
    question: "What happens after I click Convert to GIF?",
    answer:
      "The tool converts your files one by one and shows a download button as each one finishes.",
  },
  {
    question: "How many PNG images can I convert at once?",
    answer:
      "You can convert up to 20 PNG files in one batch.",
  },
  {
    question: "Do you store my PNG or GIF files?",
    answer:
      "No. Your files stay in your browser while the conversion runs.",
  },
  {
    question: "Will the converted GIF be animated?",
    answer:
      "No. This tool makes a still GIF image, not an animated one.",
  },
  {
    question: "When should I keep PNG instead of converting to GIF?",
    answer:
      "Keep PNG when you want better image quality, smoother colors, or cleaner transparency.",
  },
  {
    question: "Can I download GIF files before the whole batch finishes?",
    answer:
      "Yes. You can download each file as soon as it is ready.",
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

export function PngToGifExplainer() {
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
