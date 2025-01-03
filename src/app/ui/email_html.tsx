import { CampaignEmail } from '../lib/model/campaign';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { renderToString } from 'react-dom/server';
import DOMPurify from 'dompurify';
import { Email } from '../lib/model/email';

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
  const renderHtml = () => {
    return parse(DOMPurify.sanitize(atob(email.html || defaultHtml)), {
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
                      top: '-8px',
                      right: '-12px',
                      backgroundColor: '#f04e4e',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
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
    <div
      dangerouslySetInnerHTML={{
        __html: renderToString(renderHtml()),
      }}
    />
  );
}
