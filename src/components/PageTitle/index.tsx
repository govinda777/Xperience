import React from 'react';

const UnderlineSvg = () => (
  <svg 
    viewBox="0 0 120 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -bottom-2 left-0 w-full"
    preserveAspectRatio="none"
    style={{ transform: 'scale(1.1)' }}
  >
    <path 
      d="M2 6.5C20 5.5 38 4.5 55.5 5C74 5.5 92.5 7 110 8.5C112 8.7 114 9 116 9.2"
      stroke="#E85D04"
      strokeWidth="4"
      strokeLinecap="round"
      style={{ paintOrder: 'stroke' }}
    />
    <path 
      d="M4 4.5C22 3.5 40 2.5 57.5 3C76 3.5 94.5 5 112 6.5C114 6.7 116 7 118 7.2"
      stroke="#E85D04"
      strokeWidth="3"
      strokeLinecap="round"
      style={{ paintOrder: 'stroke' }}
    />
  </svg>
);

interface PageTitleProps {
  title: string;
  highlightedWord: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  highlightedWord,
  className = ""
}) => {
  const parts = title.split(highlightedWord);
  const textBeforeHighlight = parts[0];
  const lastSpaceIndex = textBeforeHighlight.lastIndexOf(' para os seus ');
  const firstLine = textBeforeHighlight.slice(0, lastSpaceIndex);
  const secondLineStart = textBeforeHighlight.slice(lastSpaceIndex + 1);

  return (
    <div className="w-full bg-white">
      <h1 className={`w-full text-center py-16 ${className}`}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-5xl font-bold leading-tight tracking-normal">
            {firstLine}
            <br />
            <span className="block mt-2">
              {secondLineStart}
              <span className="relative inline-block">
                {highlightedWord}
                <UnderlineSvg />
              </span>
              {parts[1]}
            </span>
          </div>
        </div>
      </h1>
    </div>
  );
};

export default PageTitle;