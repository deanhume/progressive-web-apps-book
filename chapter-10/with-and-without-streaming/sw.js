self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  if (requestURL.origin != location.origin) return;

  if (requestURL.pathname.endsWith('with.html')) {
    event.respondWith(htmlStream());
  }
});

function retab(str) {
  // remove blank lines
  str = str.replace(/^\s*\n|\n\s*$/g, '');
  const firstIndent = /^\s*/.exec(str)[0];
  return str.replace(RegExp('^' + firstIndent, 'mg'), '');
}

self.addEventListener('fetch', event => {
    event.respondWith(htmlStream());
});

function htmlStream() {
  const html = retab(`<!DOCTYPE html><p>This specification provides APIs for creating, composing, and consuming streams of data. These streams are designed to map efficiently to low-level I/O primitives, and allow easy composition with built-in backpressure and queuing. On top of streams, the web platform can build higher-level abstractions, such as filesystem or socket APIs, while at the same time users can use the supplied tools to build their own streams which integrate well with those of the web platform.</p>`);

  const stream = new ReadableStream({
    start: controller => {
      const encoder = new TextEncoder();
      let pos = 0;
      let chunkSize = 1;

      function push() {
        if (pos >= html.length) {
          controller.close();
          return;
        }

        controller.enqueue(
          encoder.encode(html.slice(pos, pos + chunkSize))
        );

        pos += chunkSize;
        setTimeout(push, 50);
      }

      push();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html'
    }
  });
}
