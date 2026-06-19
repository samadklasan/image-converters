type TiffToJpgToolCardIconProps = {
  disableGroupHover?: boolean;
};

export function TiffToJpgToolCardIcon({
  disableGroupHover = false,
}: TiffToJpgToolCardIconProps) {
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
        <path d="M325 154.83a5 5 0 0 1-5-5V102.07L247.93 30H100A20 20 0 0 0 80 50v98.17a5 5 0 0 1-10 0V50a30 30 0 0 1 30-30H250a5 5 0 0 1 3.54 1.46l75 75A5 5 0 0 1 330 100v49.83a5 5 0 0 1-5 5Z" />
        <path d="M300 380H100a30 30 0 0 1-30-30V275a5 5 0 0 1 10 0v75a20 20 0 0 0 20 20H300a20 20 0 0 0 20-20V275a5 5 0 0 1 10 0v75A30 30 0 0 1 300 380Z" />
        <path d="M275 280H125a5 5 0 0 1 0-10H275a5 5 0 0 1 0 10Z" />
        <path d="M325 280H75a30 30 0 0 1-30-30V173.17a30 30 0 0 1 30-30h.2l250 1.66a30.09 30.09 0 0 1 29.81 30V250A30 30 0 0 1 325 280ZM75 153.17a20 20 0 0 0-20 20V250a20 20 0 0 0 20 20H325a20 20 0 0 0 20-20V174.83a20.06 20.06 0 0 0-19.88-20l-250-1.66Z" />
        <path d="M159.86 182.68v36.8q0 9.18-4 13.26t-12.64 4.08a28.7 28.7 0 0 1-7.77-.82v-7.73q4.37.31 6.17.31 4.8 0 6.56-1.8t1.76-7.3v-36.8Z" />
        <path d="M180.68 236h-9.61v-53.32h21.84q9.34 0 13.85 4.71a16.37 16.37 0 0 1-.37 22.95A17.49 17.49 0 0 1 194 214.87h-13.32Zm0-29.37h11.37q4.45 0 6.8-2.19a7.58 7.58 0 0 0 2.34-5.82A8 8 0 0 0 199 193q-2.17-2.34-7.83-2.34h-10.49Z" />
        <path d="M259.47 208.73V236h-4.26l-2.93-7.19q-4.65 8-14.41 8-10.9 0-16.27-8.28a34.45 34.45 0 0 1-5.37-19.18q0-11.52 6-19.51t16.78-8q8 0 13.24 4.67a20.55 20.55 0 0 1 6.56 11.62l-8.36 1.48q-2.34-9.76-11.21-9.77a11.17 11.17 0 0 0-9.24 4.61q-3.57 4.61-3.57 14.18 0 20.2 12.66 20.2a10.74 10.74 0 0 0 8.14-3.4 12.52 12.52 0 0 0 3.22-9h-11v-7.73Z" />
      </svg>
    </div>
  );
}
