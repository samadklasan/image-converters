const usageSteps = [
  {
    "title": "Upload the JPG files you need",
    "description": "Choose one JPG or load a small batch of JPG images from your device."
  },
  {
    "title": "Convert to BMP",
    "description": "Start the job and the converter will rebuild each image as a BMP file one at a time."
  },
  {
    "title": "Download the finished BMP files",
    "description": "Save each completed bitmap as soon as it is ready, or export the full batch together."
  }
] as const;

const faqs = [
  {
    "question": "Is this JPG to BMP converter free?",
    "answer": "Yes. You can convert JPG files to BMP here without paying."
  },
  {
    "question": "Which uploads are supported?",
    "answer": "This converter accepts JPG and JPEG image files only."
  },
  {
    "question": "What is the maximum file size?",
    "answer": "You can upload JPG files up to 50 MB each in this converter."
  },
  {
    "question": "Why convert JPG to BMP?",
    "answer": "BMP can still be useful for legacy software, raw bitmap workflows, and systems that expect a basic raster image format."
  },
  {
    "question": "Will BMP files be larger than JPG files?",
    "answer": "Usually yes. BMP files are commonly much larger than JPG files."
  },
  {
    "question": "Is BMP a good choice for sharing online?",
    "answer": "Usually no. BMP is better for compatibility-focused workflows than for lightweight web sharing."
  },
  {
    "question": "Does BMP improve a low-quality JPG?",
    "answer": "No. It changes the container format, but it does not recreate detail lost in the original JPG."
  },
  {
    "question": "How many JPG images can I convert per batch?",
    "answer": "You can convert up to 20 JPG images in one batch."
  },
  {
    "question": "Do you store my files after conversion?",
    "answer": "No. All conversion happens in your browser, and we do not store your images on our servers."
  }
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

export function JpgToBmpExplainer() {
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
