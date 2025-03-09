import { useState, useEffect, useRef } from 'react';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { renderToString } from 'react-dom/server';
import { Email } from '../_lib/model/email';

const defaultHtml = 'PGRpdj48L2Rpdj4='; // <div></div>

export default function EmailHtml({
  email,
  opts = {
    clickCounts: {},
  },
}: {
  email: Email;
  opts?: {
    clickCounts?: Record<string, number>;
  };
}) {
  const [html, setHtml] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iFrameHeight, setIFrameHeight] = useState('100px');

  // prevent ssr mismatch
  useEffect(() => {
    setHtml(email.html);
  }, [email.html]);

  const renderHtml = () => {
    return parse(atob(html || defaultHtml), {
      replace: (domNode: DOMNode) => {
        if (opts.clickCounts) {
          if (
            domNode instanceof Element &&
            domNode.name === 'a' &&
            domNode.attribs &&
            domNode.attribs.href
          ) {
            const href = domNode.attribs.href;
            const clickCount = opts.clickCounts[href] || 0;

            if (clickCount > 0) {
              return (
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {domToReact([domNode])}
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-14px',
                      backgroundColor: '#f04e4e',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {clickCount}
                  </span>
                </span>
              );
            }
          }
        }
      },
    });
  };

  const adjustHeight = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const newHeight = iframe.contentWindow?.document.body.scrollHeight || 0;
      if (newHeight > 0) {
        setIFrameHeight(`${newHeight * 2}px`);
      }
    }
  };

  return (
    <iframe
      ref={iframeRef}
      srcDoc={renderToString(renderHtml())}
      className={`flex h-[${iFrameHeight}] w-[100%] items-center justify-center rounded-md border-1 p-2`}
      onLoad={adjustHeight}
    />
  );
}
