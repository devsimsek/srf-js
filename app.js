const srf = new SRF();
let srf_api = {}
srf.send.get("/api.json").then(result => {
  srf_api = JSON.parse(result.responseText)
}).catch(e => {
  alert("Can't reach api." + e)
})
srf.load.style("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css")

srf.route("/", () => {
  srf.page.style.body("p-2 m-2")
  srf.page.set.loadStatus()
  let nav = new Nav({
    class: "navbar navbar-expand-lg bg-dark navbar-dark rounded-4",
    brand: `<div class="d-flex"><img src="/assets/images/logo.png" style="width: 32px"><span class="ms-2">SRF Framework</span></div>`,
    list: {
      type: "ul",
      class: "ms-auto my-2 my-lg-0"
    },
    items: [
      { label: "Home", url: "", active: true },
      { label: "Docs", url: "docs" },
    ],
  })
  nav.present()
  srf.page.append.body(srf.load.template("views/home"))
})
srf.route("/docs", () => {
  srf.page.style.body("p-2 m-2")
  srf.page.set.loadStatus()
  let nav = new Nav({
    class: "navbar navbar-expand-lg bg-dark navbar-dark rounded-4",
    brand: `<div class="d-flex"><img src="/assets/images/logo.png" style="width: 32px"><span class="ms-2">SRF Framework</span></div>`,
    list: {
      type: "ul",
      class: "ms-auto my-2 my-lg-0"
    },
    items: [
      { label: "Home", url: "" },
      { label: "Docs", url: "docs", active: true },
    ],
  })
  nav.present()
  srf.page.append.body(srf.load.template("views/docs_home"))
})
srf.route("/docs/{all}", async (doc) => {
  if (srf_api.docs === undefined) {
    await srf.send.get("/api.json").then(result => {
      srf_api = JSON.parse(result.responseText)
    }).catch(e => {
      alert("Can't reach api." + e)
    })
  }
  srf.page.style.body("p-2 m-2")
  srf.page.set.loadStatus()
  let nav = new Nav({
    class: "navbar navbar-expand-lg bg-dark navbar-dark rounded-4",
    brand: `<div class="d-flex"><img src="/assets/images/logo.png" style="width: 32px"><span class="ms-2">SRF Framework</span></div>`,
    list: {
      type: "ul",
      class: "ms-auto my-2 my-lg-0"
    },
    items: [
      { label: "Home", url: "" },
      { label: "Docs", url: "docs", active: true },
    ],
  })
  nav.present()
  doc = srf_api.docs.filter(d => d.document === doc[0])
  let body = ""
  if (doc[0] !== undefined) {
    body = srf.load.template("views/docs", {
      "title": doc[0].name,
      "contents": doc[0].contents,
      "version": doc[0].version_code,
      "author.name": doc[0].writer.name,
      "author.image": doc[0].writer.image,
      "author.description": doc[0].writer.description
    })
  } else {
    alert("Documentation is not complete, please check up later.")
    srf.page.redirect("docs")
  }
  srf.page.append.body(body)
})
srf.route("/404", () => { srf.page.set.title("404 Not Found"); srf.page.set.body("Not Found") })
srf.run()
/*
let app_div = document.getElementById('srf-app');
let srf_api = {versions: [], docs: []}
//sendGet("http://localhost:8080/api.json").then(r => {
//  srf_api = JSON.parse(r.responseText)
//}).catch(e => alert(e))

// Views
registerView('home', async function () {
  setTitle('SRF - Home')
  let body = ""
  body += await loadTemplate("views/home") 
  app_div.innerHTML = body
});

registerView('docs', async function (params = null) {
  setTitle('SRF - Docs')
  let body = ""
  if (params !== null) {
    body += await loadTemplate("views/docs")
    let doc = srf_api.docs.filter(d => d.document === params[0])
    body = body.replace("{{ title }}", doc[0].name)
    body = body.replace("{{ contents }}", doc[0].contents)
    body = body.replace("{{ version }}", doc[0].version_code)
    body = body.replaceAll("{{ author.name }}", doc[0].writer.name)
    body = body.replaceAll("{{ author.image }}", doc[0].writer.image)
    body = body.replaceAll("{{ author.description }}", doc[0].writer.description);
  } else {
    body =   body += await loadTemplate("views/docs_home")
  }
  app_div.innerHTML = body
})

registerStyle("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css")
registerScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js")
registerScript("https://getbootstrap.com/docs/5.3/assets/js/color-modes.js")

// Routes
registerRoute('/', 'home');
registerRoute('/documentation', 'docs')
registerRoute('/docs', 'docs')
registerRoute('/docs/{all}', 'docs')
registerRoute('/404', () => {
  app_div.innerHTML = `<style>body {background-color: #f8f9fa;}.error-container {display: flex;justify-content: center;align-items: center;height: 100vh;}.error-text {text-align: center;}.error-text h1 {font-size: 4rem;}.error-text p {font-size: 1.2rem;}</style><div class="error-container"><div class="error-text"><h1>404</h1><p>Oops! The page you requested was not found.</p><a href="" class="btn btn-primary">Go Back to Homepage</a></div></div>`
});

// Listen for the changes
window.addEventListener('load', router);
window.addEventListener('hashchange', router);
*/