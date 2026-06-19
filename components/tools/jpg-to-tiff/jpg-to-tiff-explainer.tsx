const usageSteps = [
  {
    "title": "Upload your JPG files",
    "description": "Add the JPG images you want to convert from your device, one at a time or in a batch."
  },
  {
    "title": "Convert them to TIFF",
    "description": "Start the conversion and the tool will process each queued file into TIFF format in sequence."
  },
  {
    "title": "Download the completed TIFF files",
    "description": "Save each result individually as soon as it is ready, or export the whole finished batch together."
  }
] as const;

const faqs = [
  {
    "question": "Is this JPG to TIFF converter free?",
    "answer": "Yes. You can convert JPG files to TIFF here for free."
  },
  {
    "question": "What files are supported?",
    "answer": "This converter accepts JPG and JPEG image files only."
  },
  {
    "question": "What is the maximum file size?",
    "answer": "You can upload JPG files up to 50 MB each in this converter."
  },
  {
    "question": "Why convert JPG to TIFF?",
    "answer": "TIFF is a common choice for print work, desktop editing tools, and archive-oriented image workflows."
  },
  {
    "question": "Will TIFF usually be larger than JPG?",
    "answer": "Yes, often by a lot. TIFF prioritizes quality-focused workflows more than small file sizes."
  },
  {
    "question": "Does TIFF restore detail lost in the original JPG?",
    "answer": "No. Converting to TIFF does not recover detail that was already removed by JPG compression."
  },
  {
    "question": "When should I keep JPG instead of converting to TIFF?",
    "answer": "Keep JPG when you need smaller files for sharing, uploads, or everyday web use."
  },
  {
    "question": "How many JPG images can I convert in one batch?",
    "answer": "You can convert up to 20 JPG images per batch."
  },
  {
    "question": "Do you store my uploaded files?",
    "answer": "No. Your files are used only to complete the conversion request and are not stored on our servers."
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

export function JpgToTiffExplainer() {
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
