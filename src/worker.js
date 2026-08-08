/**
 * docs.agentpaas.ai - static Docusaurus assets.
 */

const REDIRECTS = {
  "/trial/thirty-minute-path": "/trial/guided-demo",
  "/trial/thirty-minute-path/": "/trial/guided-demo/",
  "/trial/what-agentpaas-is": "/trial/what-is-agentpaas",
  "/trial/what-agentpaas-is/": "/trial/what-is-agentpaas/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const dest = REDIRECTS[url.pathname];
    if (dest) {
      url.pathname = dest;
      return Response.redirect(url.toString(), 301);
    }
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response("Not found", { status: 404 });
  },
};
