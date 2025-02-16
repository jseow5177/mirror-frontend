import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { renderToString } from 'react-dom/server';
import DOMPurify from 'isomorphic-dompurify';
import { Email } from '../_lib/model/email';

const defaultHtml = 'PGRpdj48L2Rpdj4='; // <div></div>

// prevent attributes of <a> tag from being removed
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener');
  }
});

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
    <div
      dangerouslySetInnerHTML={{
        __html: renderToString(renderHtml()),
      }}
      className='max-w-[600px]'
    />
  );
}
