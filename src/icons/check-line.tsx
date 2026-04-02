import React from 'react';

interface CheckLineProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const CheckLine: React.FC<CheckLineProps> = ({
  size = 16,
  color = 'currentColor',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    ><path
              d="M13.4017 4.35986L6.12166 11.6399L2.59833 8.11657"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
    </svg>
  );
};

export default CheckLine;
