const usageSteps = [
  {
    "title": "Upload your JPG files",
    "description": "Choose a single JPG or add a batch of JPG photos from your device."
  },
  {
    "title": "Convert to AVIF",
    "description": "Run the converter and each image will be processed into an AVIF file in sequence."
  },
  {
    "title": "Download smaller AVIFs",
    "description": "Save each finished file right away, or download the completed batch once everything is ready."
  }
] as const;

const faqs = [
  {
    "question": "Is this JPG to AVIF converter free to use?",
    "answer": "Yes. You can convert JPG files to AVIF here for free."
  },
  {
    "question": "What uploads are supported?",
    "answer": "This converter accepts JPG and JPEG image files only."
  },
  {
    "question": "What is the maximum file size?",
    "answer": "You can upload JPG files up to 50 MB each in this converter."
  },
  {
    "question": "Why convert JPG to AVIF?",
    "answer": "AVIF is often chosen for smaller file sizes and more efficient delivery on modern websites and apps."
  },
  {
    "question": "Will AVIF always look identical to the original JPG?",
    "answer": "Not always. AVIF is efficient, but final appearance depends on the image and compression settings."
  },
  {
    "question": "Can AVIF make my image transparent after converting from JPG?",
    "answer": "No. A JPG source does not contain transparency data to recover during conversion."
  },
  {
    "question": "Is AVIF a good choice for web delivery?",
    "answer": "Yes. AVIF is a strong option when you want lighter image files and modern browser-focused delivery."
  },
  {
    "question": "How many JPG images can I convert in one batch?",
    "answer": "You can convert up to 20 JPG images at a time."
  },
  {
    "question": "Do you keep my uploaded images?",
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

export function JpgToAvifExplainer() {
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
