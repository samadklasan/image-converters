const usageSteps = [
  {
    "title": "Upload your JPG images",
    "description": "Add one JPG or a batch of JPG files from your computer or phone."
  },
  {
    "title": "Convert them to WEBP",
    "description": "Start the batch and the tool will convert each queued image to WEBP in order."
  },
  {
    "title": "Download ready-to-use WEBPs",
    "description": "Save completed files one by one, or grab the full finished batch in one download."
  }
] as const;

const faqs = [
  {
    "question": "Is this JPG to WEBP converter free?",
    "answer": "Yes. You can convert JPG images to WEBP here for free."
  },
  {
    "question": "What files can I upload?",
    "answer": "This tool accepts JPG and JPEG image files only."
  },
  {
    "question": "What is the maximum file size?",
    "answer": "You can upload JPG files up to 50 MB each in this converter."
  },
  {
    "question": "Why would I convert JPG to WEBP?",
    "answer": "WEBP is commonly used for websites because it can reduce image weight while staying broadly usable in modern browsers."
  },
  {
    "question": "Will WEBP files usually be smaller than JPG files?",
    "answer": "Often yes, especially for web delivery, though results depend on the image itself."
  },
  {
    "question": "Is WEBP widely supported now?",
    "answer": "Yes. WEBP support is broad across current browsers, which makes it a practical format for web projects."
  },
  {
    "question": "Can converting JPG to WEBP restore lost detail?",
    "answer": "No. Converting formats does not recover detail already removed by the original JPG compression."
  },
  {
    "question": "Can I convert multiple JPG files together?",
    "answer": "Yes. You can process up to 20 JPG images in one batch."
  },
  {
    "question": "Do you store the images I upload?",
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

export function JpgToWebpExplainer() {
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
