type AvifToTiffToolCardIconProps = {
  disableGroupHover?: boolean;
};

export function AvifToTiffToolCardIcon({
  disableGroupHover = false,
}: AvifToTiffToolCardIconProps) {
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
        <path d="M325 105H250a5 5 0 0 1-5-5V25a5 5 0 0 1 10 0V95h70a5 5 0 1 1 0 10Z" />
        <path d="M325 154.83a5 5 0 0 1-5-5V102.07L247.93 30H100A20 20 0 0 0 80 50v98.17a5 5 0 0 1-10 0V50a30 30 0 0 1 30-30H250a5 5 0 0 1 3.54 1.46l75 75A5 5 0 0 1 330 100v49.83A5 5 0 0 1 325 154.83Z" />
        <path d="M300 380H100a30 30 0 0 1-30-30V275a5 5 0 0 1 10 0v75a20 20 0 0 0 20 20H300a20 20 0 0 0 20-20V275a5 5 0 0 1 10 0v75A30 30 0 0 1 300 380Z" />
        <path d="M275 280H125a5 5 0 0 1 0-10H275a5 5 0 0 1 0 10Z" />
        <path d="M325 280H75a30 30 0 0 1-30-30V173.17a30 30 0 0 1 30.19-30l250 1.66a30.09 30.09 0 0 1 29.81 30V250A30 30 0 0 1 325 280ZM75 153.17a20 20 0 0 0-20 20V250a20 20 0 0 0 20 20H325a20 20 0 0 0 20-20V174.83a20.06 20.06 0 0 0-19.88-20l-250-1.66Z" />
        <g transform="translate(-17 0)">
          <path d="M192.81 236H182.54l-4.26-12.7H157.77L153.59 236h-8.2l17.7-53.32h11.84Zm-17.11-20.39-7.77-23.79-7.77 23.79Z" />
          <path d="M216.68 236h-9.77l-16.45-53.32h10.16l12.23 40.86 12.5-40.86h8Z" />
          <path d="M249 236h-9.61V182.68H249Z" />
          <path d="M288.5 182.68H260.81V236h9.61V211.76h15.46V204.03H270.42V190.41H288.5Z" />
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
    </div>
  );
}
