hottopod – a small Node.js web server utility and framework
===========================================================

This is a really brand new project, and I’m focusing on writing code instead of
documentation right now. Bear with me for some days.

What’s it gonna do?

It’s reasonably easy to react to HTTP requests in Node.js. However, there are
some repetitive tasks involved like parsing the request, choosing a handler etc.

Additionally, not all requests have to be handled dynamically. If you’re
building a web application, you need to serve CSS, JS, images etc.

hottopod is supposed to help you with all of this. You will be able to define
vhosts either on the same or on different ports, define simple or regex-based
matching rules and define filesystem paths that should be mapped to the web.

In future releases, CGI-like calls may also be possible.

Currently, hottopod doesn’t do a lot. The source is reasonably documented, the
example.js file shows how to use the currently available features.

Stay tuned on GitHub for news. hottopod will be released under some BSD-style
license or something like that.
