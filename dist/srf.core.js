// Route Model
class Route {
  path;
  handler;
  constructor(path, handler) {
    this.path = path
    this.handler = handler
  }
}

class SRF {
  constructor() {
    console.info("SRF.JS: This site uses SRF framework to implement most useful features without coding anything. Try now! (https://github.com/devsimsek/srf-js)")
    this.routes = {}
    this.handlers = {}
    window.addEventListener('hashchange', this.run.bind(this));
  }

  route(path, handler) {
    if (typeof handler === 'function') {
      return this.routes[path] = handler;
    } else if (typeof handler === 'string') {
      return this.routes[path] = this.handlers[handler];
    } else {
      return null;
    }
  }

  handler(route, handler) {
    return this.handlers[route] = handler;
  }

  generate = {
    id() {
      return Math.random().toString(36).substring(2, 10)
    }
  }

  page = {
    style: {
      body(classList) { if (document.querySelector("body") !== null) document.querySelector("body").classList = classList }
    },
    set: {
      body(body) { document.querySelector("#srf-app").innerHTML = body },
      title(title) { document.querySelector("title").innerText = title },
      append(component) { document.querySelector("#srf-app").innerHTML += component },
      loadStatus() { if (document.querySelector("#srf-loader") !== null) document.querySelector("#srf-loader").style = "display: none" }
    },
    append: {
      body(body) { document.querySelector("#srf-app").innerHTML += body }
    },
    get: {
      query(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
    },
    redirect(page, out = false) {
      if (out) window.location.href = page
      else window.location.href = window.location.href.split("#")[0] + "#/" + page;
    },
    onload() {
      window.onbeforeunload = function () {
        this.redirect(document.referrer, true)
        return true
      };
      window.onbeforeunload = null;
      document.querySelectorAll("a").forEach(element => {
        element.onclick = (e) => {
          if (!element.getAttribute("out")) {
            this.redirect(element.href.replace(/^.*\/\/[^\/]+/, '').replace('/', ''));
            e.preventDefault();
          }
        }
      })
    }
  }

  send = {
    async get(url, content_type = 'application/json') {
      let xhr = new XMLHttpRequest()
      xhr.open("GET", url, false)
      xhr.setRequestHeader('Content-Type', content_type)
      try {
        xhr.send()
        return xhr
      } catch (error) {
        console.error(`SRF.JS (ERROR): ${error}`)
        return error
      }
    },
    post(url, body, content_type = 'application/json') {
      let xhr = new XMLHttpRequest()
      xhr.open("POST", url, false)
      xhr.setRequestHeader('Content-Type', content_type)
      try {
        xhr.send(body)
        return xhr
      } catch (error) {
        console.error(`SRF.JS (ERROR): ${error}`)
        return error
      }
    }
  }

  load = {
    template(name, args = null, url = "") {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url + name + '.html', false);
      try {
        xhr.send()
        if (xhr.status !== 200) alert("Error, SRF can't load template.");
        if (args !== null) {
          let template = xhr.responseText;
          return template.replaceAll(/{{ (.*?) }}/g, (match, key) => args[key] || match);
        }
        return xhr.responseText
      } catch (e) {
        alert("Error, SRF can't load template.")
        console.error(e)
      }
    },
    script(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`head > script[src="${src}"]`) !== null) return resolve()
        const script = document.createElement("script")
        script.src = src
        script.async = true
        document.head.appendChild(script)
        script.onload = resolve
        script.onerror = reject
      })
    },
    style(src) {
      document.querySelector('head').innerHTML += "<link rel='stylesheet' href='" + src + "'>"
    }
  }

  resolveRoute(activated_route) {
    let mr = { "handler": this.routes["404"], "params": activated_route }
    Object.keys(this.routes).forEach(route => {
      if (activated_route === route) {
        mr = { "handler": this.routes[activated_route], "params": null }
      } else {
        let r_route = route.replace('{url}', '([0-9a-zA-Z]+)')
        r_route = r_route.replace('{id}', '([0-9]+)')
        r_route = r_route.replace('{all}', '(.*)')
        let rg = new RegExp(`${r_route}`)
        let m = activated_route.match(rg);
        if (m && m[0] !== "/") {
          m.shift()
          mr = { "handler": this.routes[route], "params": m }
        }
      }
    })
    return mr
  }

  async run() {
    let url = window.location.hash.slice(1) || '/';
    let route = this.resolveRoute(url);
    try {
      this.page.set.body("")
      if (typeof route["handler"] === "function") await route["handler"](route["params"]);
      else await route();
      this.page.onload()
    } catch (e) {
      this.page.redirect("404")
      if (route["handler"] !== undefined)
        console.error(`Details: ${e}`)
      console.error(`SRF.JS (ERROR): ${url} not found.`)
      return
    }
  }
}
