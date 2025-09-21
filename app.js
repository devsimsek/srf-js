const srf = new SRF();
let srf_api = {}
srf.send.get("/api.json").then(result => {
  srf_api = JSON.parse(result.responseText)
}).catch(e => {
  alert("Can't reach api." + e)
})
srf.load.style("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css")

srf.route("/", () => {
  srf.page.set.title("SRF Framework")
  srf.page.style.body("p-2 m-2")
  srf.page.set.loadStatus()
  let nav = new Nav({
    class: "navbar navbar-expand-lg bg-dark navbar-dark rounded-4 fixed-top m-4",
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
  srf.page.set.title("SRF Docs")
  srf.page.style.body("p-2 m-2 mt-5")
  srf.page.set.loadStatus()
  let nav = new Nav({
    class: "navbar navbar-expand-lg bg-dark navbar-dark rounded-4 fixed-top m-4",
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
  srf.page.set.title("SRF Docs")
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
    srf.page.set.title("SRF Docs - " + doc[0].name)
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