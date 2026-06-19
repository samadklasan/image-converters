type TiffToBmpToolCardIconProps = {
  disableGroupHover?: boolean;
};

export function TiffToBmpToolCardIcon({
  disableGroupHover = false,
}: TiffToBmpToolCardIconProps) {
  return (
    <div
      className={`flex items-center justify-center gap-1.5 text-brand transition-colors sm:gap-2 ${
        disableGroupHover ? "" : "group-hover:text-cardIconHover"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="h-7 w-7 shrink-0 fill-current sm:h-8 sm:w-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M325 105H250a5 5 0 0 1-5-5V25a5 5 0 1 1 10 0V95h70a5 5 0 1 1 0 10Z" />
        <path d="M325 154.83a5 5 0 0 1-5-5V102.07L247.93 30H100A20 20 0 0 0 80 50v98.17a5 5 0 0 1-10 0V50a30 30 0 0 1 30-30H250a5 5 0 0 1 3.54 1.46l75 75A5 5 0 0 1 330 100v49.83A5 5 0 0 1 325 154.83Z" />
        <path d="M300 380H100a30 30 0 0 1-30-30V275a5 5 0 0 1 10 0v75a20 20 0 0 0 20 20H300a20 20 0 0 0 20-20V275a5 5 0 0 1 10 0v75A30 30 0 0 1 300 380Z" />
        <path d="M275 280H125a5 5 0 0 1 0-10H275a5 5 0 0 1 0 10Z" />
        <path d="M325 280H75a30 30 0 0 1-30-30V173.17a30 30 0 0 1 30.19-30l250 1.66a30.09 30.09 0 0 1 29.81 30V250A30 30 0 0 1 325 280ZM75 153.17a20 20 0 0 0-20 20V250a20 20 0 0 0 20 20H325a20 20 0 0 0 20-20V174.83a20.06 20.06 0 0 0-19.88-20l-250-1.66Z" />
        <g transform="translate(9 0)">
          <path d="M128 182.68h36v7.73h-13.2V236h-9.61v-45.59H128Z" />
          <path d="M181 236h-9.61v-53.32H181Z" />
          <path d="M218.5 182.68H190.81V236h9.61v-24.24h15.46v-7.73h-15.46v-13.62h18.08Z" />
          <path d="M254.5 182.68H226.81V236h9.61v-24.24h15.46v-7.73h-15.46v-13.62h18.08Z" />
        </g>
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 stroke-current sm:h-5 sm:w-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
        />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="h-7 w-7 shrink-0 fill-current sm:h-8 sm:w-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M325 105H250a5 5 0 0 1-5-5V25a5 5 0 1 1 10 0V95h70a5 5 0 0 1 0 10Z" />
        <path d="M325 154.83a5 5 0 0 1-5-5V102.07L247.93 30H100A20 20 0 0 0 80 50v98.17a5 5 0 0 1-10 0V50a30 30 0 0 1 30-30H250a5 5 0 0 1 3.54 1.46l75 75A5 5 0 0 1 330 100v49.83A5 5 0 0 1 325 154.83Z" />
        <path d="M300 380H100a30 30 0 0 1-30-30V275a5 5 0 0 1 10 0v75a20 20 0 0 0 20 20H300a20 20 0 0 0 20-20V275a5 5 0 0 1 10 0v75A30 30 0 0 1 300 380Z" />
        <path d="M275 280H125a5 5 0 0 1 0-10H275a5 5 0 0 1 0 10Z" />
        <path d="M325 280H75a30 30 0 0 1-30-30V173.17a30 30 0 0 1 30-30h.2l250 1.66a30.09 30.09 0 0 1 29.81 30V250A30 30 0 0 1 325 280ZM75 153.17a20 20 0 0 0-20 20V250a20 20 0 0 0 20 20H325a20 20 0 0 0 20-20V174.83a20.06 20.06 0 0 0-19.88-20l-250-1.66Z" />
        <g transform="translate(17 0)">
          <path d="M138.61 236H120V182.68h18.79q8.09 0 12.29 3.42a11.32 11.32 0 0 1 4.2 9.11 10.66 10.66 0 0 1-6.91 10.12q8.36 2.54 8.36 13 0 8-4.74 12.25T138.61 236Zm-9-31.31h7.77q4.49 0 6.37-1.79a6 6 0 0 0 1.87-4.55 5.6 5.6 0 0 0-1.91-4.65q-1.91-1.48-6.42-1.48h-7.68Zm0 23.79h8.32q4.94 0 6.97-1.94a7.16 7.16 0 0 0 2.03-5.49 7.06 7.06 0 0 0-2.19-5.53q-2.19-1.99-6.72-1.99h-8.41Z" />
        </g>
        <g transform="translate(5 0)">
          <path d="M176 236V182.68h10l10 31.32 10-31.32h10V236h-8.6V198.6L199.1 236h-5.2l-8.3-37.4V236Z" />
        </g>
        <path d="M238.61 236H229V182.68h21.84q9.34 0 13.85 4.71a16.37 16.37 0 0 1-.37 22.95 17.49 17.49 0 0 1-12.38 4.53h-13.33Zm0-29.37H250q4.45 0 6.8-2.19a7.58 7.58 0 0 0 2.34-5.82A8 8 0 0 0 257 193q-2.17-2.34-7.83-2.34h-10.56Z" />
      </svg>
    </div>
  );
}
