import React from 'react';

interface ChevronLeftProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const ChevronLeft: React.FC<ChevronLeftProps> = ({
  size = 20,
  color = 'currentColor',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><path
                d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
    </svg>
  );
};

export default ChevronLeft;
