import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { renderToString } from 'react-dom/server';
import { Email } from '../_lib/model/email';
import { useRef } from 'react';

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
  const iframeRef = useRef(null);

  const renderHtml = () => {
    return parse(atob(email.html || defaultHtml), {
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

  return (
    <iframe
      srcDoc={renderToString(renderHtml())}
      ref={iframeRef}
      className='w-[50%] rounded-md border-1 p-2'
    />
  );
}
