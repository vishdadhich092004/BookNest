const ElegantDotLoader = ({ size = 40, color = "#fff" }) => {
  const dotSize = size / 8;
  const dotCount = 4;
  const animationDuration = 1.5;

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[...Array(dotCount)].map((_, index) => (
          <circle
            key={index}
            cx="20"
            cy="20"
            r={dotSize}
            fill={color}
            transform={`rotate(${index * 90} 20 20) translate(0 -14)`}
          >
            <animate
              attributeName="opacity"
              from="1"
              to="0.2"
              dur={`${animationDuration}s`}
              repeatCount="indefinite"
              begin={`${index * (animationDuration / dotCount)}s`}
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${index * 90} 20 20`}
              to={`${index * 90 + 360} 20 20`}
              dur={`${animationDuration}s`}
              repeatCount="indefinite"
              begin={`${index * (animationDuration / dotCount)}s`}
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default ElegantDotLoader;
