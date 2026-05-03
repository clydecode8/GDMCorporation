export default {
    async fetch(request, env) {
      const url = new URL(request.url)
  
      if (url.hostname.includes('workers.dev')) {
        return Response.redirect('https://gdmcorporate.my', 302)
      }
  
      return env.ASSETS.fetch(request)
    }
  }