const usageSteps = [
  {
    title: "Upload your GIF images",
    description:
      "Add one GIF image or a batch from your device. Animated GIF uploads are converted from their first frame.",
  },
  {
    title: "Convert to JPG",
    description:
      "Click Convert to JPG and let the tool prepare each output file in sequence.",
  },
  {
    title: "Download finished JPG files",
    description:
      "Save each converted file when it is ready, or download the whole finished batch at once.",
  },
] as const;

const faqs = [
  {
    question: "Is this GIF to JPG converter free?",
    answer:
      "Yes. You can upload GIF images, convert them to JPG, and download the results here for free.",
  },
  {
    question: "What files can I upload here?",
    answer:
      "This converter accepts GIF image files only.",
  },
  {
    question: "Why convert GIF to JPG?",
    answer:
      "Choose JPG when you want a familiar format for uploads, email attachments, messaging, and broad app support.",
  },
  {
    question: "How does image quality change in GIF to JPG?",
    answer:
      "JPG is a lossy format, so it trades some image data for smaller files that are easier to share.",
  },
  {
    question: "What happens to transparency in GIF to JPG?",
    answer:
      "JPG does not support transparency, so transparent areas are flattened onto a white background during conversion.",
  },
  {
    question: "Can I convert a batch of GIF images?",
    answer:
      "Yes. You can convert up to 20 GIF files in one batch, then save the finished results individually or all together.",
  },
  {
    question: "Do you keep my uploaded files?",
    answer:
      "No. We do not store your files on our servers. They are used only to complete the requested conversion.",
  },
  {
    question: "Do GIF uploads keep animation?",
    answer:
      "No. This converter uses the first frame of each GIF and creates a still JPG file.",
  },
  {
    question: "Can I download files before the whole batch finishes?",
    answer:
      "Yes. Each JPG file can be saved as soon as that individual conversion is ready.",
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

export function GifToJpgExplainer() {
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
