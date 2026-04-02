import React from 'react';

interface ChevronUpProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const ChevronUp: React.FC<ChevronUpProps> = ({
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
    ><path d="M15.8333 12.7083L10.6249 7.5L5.41658 12.7083" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default ChevronUp;
