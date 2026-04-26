import { useEffect, useRef } from 'react';
import katex from 'katex';

export function TeX({ math, block = false, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, {
        throwOnError: false,
        displayMode: block,
        output: 'html',
      });
    }
  }, [math, block]);
  const Tag = block ? 'div' : 'span';
  return <Tag ref={ref} className={`tex ${className}`} aria-label={math} />;
}
