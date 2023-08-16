class Component {
  constructor() {
    if (bootstrap === undefined) alert("Sorry, Bootstrap needs to be loaded before the SRF initialization in order to use component support")
    if (SRF === undefined) console.info("SRF.JS: This site uses SRF components to design its ui without designin anything. Try now! (https://github.com/devsimsek/srf-js)")
  }

  static generateID(flag = "") {
    if (flag !== "") {
      return "srf-" + flag + "-" + Math.random().toString(36).substring(2, 10);
    }
    return "srf-" + Math.random().toString(36).substring(2, 10);
  }

  render(options = null) {
  }

  present() {
  }
}

class Card extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    title: {
      type: "h1",
      style: "",
      content: "",
      custom: null,
    },
    header: {
      content: "",
      style: "",
      custom: null,
    },
    footer: {
      content: "",
      style: "",
      custom: null,
    },
    buttons: [],
    inputs: [],
    image: [],
    style: "",
  };

  html = "";

  constructor(body, options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      let b = `<div class="card ${options.class}">`;
      if (options.title.content !== "" && options.title.custom === undefined) {
        b += `<${options.title.type} style="${options.title.style}">${options.title.content}</${options.title.type}>`;
      } else if (options.title.custom !== null && options.title.custom !== undefined) {
        b += `${options.title.custom}`;
      }
      if (options.header.content !== "" && options.header.custom === undefined) {
        b += `<div class="card-header" style="${options.header.style}">${options.header.content}</div>`;
      } else if (options.header.custom !== null && options.header.custom !== undefined) {
        b += `${options.header.custom}`;
      }
      if (options.footer.content !== "" && options.footer.custom === undefined) {
        b += `<div class="card-footer">${options.footer.content}</div>`;
      } else if (options.footer.custom !== null && options.footer.custom !== undefined) {
        b += `${options.footer.custom}`;
      }
      b += `<div class="card-body">${body}</div>`;
      if (options.buttons.length > 0) {
        b += `<div class="card-buttons">`;
        options.buttons.forEach((button) => {
          b += `<button class="${button.class}">${button.label}</button>`;
        });
        b += `</div>`;
      }
      if (options.inputs.length > 0) {
        b += `<div class="card-inputs">`;
        options.inputs.forEach((input) => {
          b += `<input type="${input.type}" class="${input.class}" placeholder="${input.placeholder}" />`;
        });
        b += `</div>`;
      }
      this.html = b + `</div>`;
    } else {
      this.html = `<div class="card"><div class="card-body">${body}</div></div>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }

}

class Accordion extends Component {
  item = {
    title: "",
    body: "",
  };

  options = {
    id: Component.generateID(),
    class: "",
    items: [],
    buttons: [],
    inputs: [],
    image: [],
    style: "",
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      let parentId = Component.generateID("accordion");
      this.html = `<div class="accordion${(options.class !== "" ? " " + options.class : "")}" id="${parentId}">`;
      if (options.items !== null && options.items.length > 0) {
        options.items.forEach((item) => {
          if (item.title === undefined && item.body === undefined)
            return "ERROR";
          let id = Component.generateID("accordion-item");
          this.html += `<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="${id}">${item.title}</button></h2><div id="${id}" class="accordion-collapse collapse" data-bs-parent="#${parentId}"><div class="accordion-body">${item.body}</div></div></div>`
        });
      }
      this.html += "</div>";
    } else {
      this.html = `<div class="accordion">Empty Body</div>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Toast extends Component {
  options = {
    id: Component.generateID(),
    image: {
      src: ""
    },
    close: "Close",
    alignment: "bottom",
    type: "",
    delay: "3000",
    autohide: true,
  };

  html = "";

  constructor(title, body, options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    this.html = `<div class="toast-container position-fixed ${options.alignment} p-3 ${options.type !== "" ? " bg-" + options.type : ""}"><div id="${options.id}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="${options.autohide
    }" data-bs-delay="${options.delay}"><div class="toast-header">${options.image.src !== "" ? `<img src="${options.image.src}" class="rounded me-2">` : ""}<strong class="me-auto">${title}</strong><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="${options.close}"></button></div><div class="toast-body">${body}</div></div></div>`;
  }

  present() {
    if (this.html !== "") {
      if (document.getElementById(this.options.id) === null) {
        document.querySelector("#srf-app").innerHTML += this.html;
      }
      bootstrap.Toast.getOrCreateInstance(
        document.getElementById(this.options.id)
      ).show();
      return this.options.id;
    }
    return "";
  }
}

class Alert extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    type: "info",
    dismissible: true,
    content: "",
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      let dismissibleClass = options.dismissible ? "alert-dismissible" : "";
      this.html = `<div id="${options.id}" class="alert alert-${options.type} ${dismissibleClass} ${options.class}" role="alert">${options.content}`;
      if (options.dismissible) {
        this.html += `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
      }
      this.html += `</div>`;
    } else {
      this.html = `<div class="alert alert-info">Empty Alert</div>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Form extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    method: "post",
    action: "",
    content: "",
    inputs: [],
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<form id="${options.id}" class="${options.class}" method="${options.method}" action="${options.action}">${options.content}`;
      if (options.inputs !== null && options.inputs.length > 0) {
        options.inputs.forEach((input) => {
          let {type, label, name, value, required} = input;
          this.html += `<div class="mb-3"><label class="form-label">${label}</label><input type="${type}" name="${name}" value="${value}" ${required ? 'required' : ''}></div>`;
        });
      }
      this.html += `</form>`;
    } else {
      this.html = `<form>Empty Form</form>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

// Note to myself;
// Update this function to support adding flash messages and able to flash using array.
// Create function about if if flash is ready to dispose. Call dispose function.
class Flash extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    type: "success",
    content: "",
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<div id="${options.id}" class="alert alert-${options.type} ${options.class}" role="alert">${options.content}</div>`;
    } else {
      this.html = `<div class="alert alert-success">Empty Flash Message</div>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Badge extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    type: "primary",
    content: "",
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<span id="${options.id}" class="badge bg-${options.type} ${options.class}">${options.content}</span>`;
    } else {
      this.html = `<span class="badge bg-primary">Empty Badge</span>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Button extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    type: "button",
    content: "",
    onClick: null,
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<button id="${options.id}" class="btn ${options.class}" type="${options.type}">${options.content}</button>`;
      if (options.onClick !== null) {
        document.addEventListener("click", (event) => {
          if (event.target.matches(`#${options.id}`)) {
            options.onClick(event);
          }
        });
      }
    } else {
      this.html = `<button class="btn">Empty Button</button>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Carousel extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    items: [],
    interval: 5000,
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<div id="${options.id}" class="carousel slide ${options.class}" data-bs-ride="carousel" data-bs-interval="${options.interval}"><div class="carousel-inner">`;
      if (options.items !== null && options.items.length > 0) {
        options.items.forEach((item, index) => {
          let activeClass = index === 0 ? "active" : "";
          this.html += `<div class="carousel-item ${activeClass}">${item}</div>`;
        });
      } else {
        this.html += `<div class="carousel-item active">Empty Carousel</div>`;
      }
      this.html += `</div><button class="carousel-control-prev" type="button" data-bs-target="#${options.id}" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#${options.id}" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div>`;
    } else {
      this.html = `<div class="carousel slide">Empty Carousel</div>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class List extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    items: [],
    type: "ul",
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<${options.type} id="${options.id}" class="${options.class}">`;
      if (options.items !== null && options.items.length > 0) {
        options.items.forEach((item) => {
          this.html += `<li>${item}</li>`;
        });
      } else {
        this.html += `<li>Empty List</li>`;
      }
      this.html += `</${options.type}>`;
    } else {
      this.html = `<ul>Empty List</ul>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Toolbar extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    items: [],
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<div id="${options.id}" class="${options.class}">`;
      if (options.items !== null && options.items.length > 0) {
        options.items.forEach((item) => {
          this.html += `<div class="toolbar-item">${item}</div>`;
        });
      } else {
        this.html += `<div class="toolbar-item">Empty Toolbar</div>`;
      }
      this.html += `</div>`;
    } else {
      this.html = `<div>Empty Toolbar</div>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Modal extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    title: "",
    body: "",
    footer: "",
    buttons: []
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<div id="${options.id}" class="modal ${options.class}" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">${options.title}</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${options.body}</div>`;
      if (options.footer !== "") {
        this.html += `<div class="modal-footer">
        <p>${options.footer}</p>
        </div>`;
      } else if (options.buttons.length > 0) {
        this.html += `<div class="modal-footer">
        ${this.generateButtons(options.buttons)}
      </div>`
      }
      this.html += `</div></div></div>`;
    } else {
      this.html = `<div class="modal">Empty Modal</div>`;
    }
  }

  generateButtons(buttons) {
    if (buttons.length === 0) return "";
    let buttonsHtml = "";
    buttons.forEach((button) => {
      buttonsHtml += `<button type="button" class="btn ${button.class}" ${button.attributes}>${button.label}</button>`;
    });
    return buttonsHtml;
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      const modal = new bootstrap.Modal(document.getElementById(this.options.id));
      modal.show();
      return this.options.id;
    }
    return "";
  }
}

class Nav extends Component {
  options = {
    id: Component.generateID(),
    brand: "",
    class: "",
    items: [],
    type: "nav",
    list: {
      type: "ul",
      class: ""
    },
    placement: "top",
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<${options.type} class="navbar${(options.class !== "" ? ` ${options.class}` : "")}" id="${options.id}">
      <div class="container-fluid">
        ${(options.brand !== "") ? `<a class="navbar-brand" href="/">${options.brand}</a>` : ""}
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-toggle="collapse" data-target="#collapse-${options.id}" data-bs-target="#collapse-${options.id}" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapse-${options.id}">`;
      if (options.items !== null && options.items.length > 0) {
        this.html += `<${options.list.type} class="navbar-nav${(options.list.class !== "" ? ` ${options.list.class}` : "")}">`
        options.items.forEach((item, index) => {
          let activeClass = item.active === true ? " active" : "";
          if (item.id === undefined) item.id = Component.generateID()
          this.html += `<a class="nav-link${activeClass}" id="nav-${item.id}" href="${item.url}">${item.label}</a>`;
        });
        this.html += `</${options.list.type}>`
      } else {
        this.html += `<a class="nav-link active" href="#">Empty Nav</a>`;
      }
      this.html += `</div></div></${options.type}>`;
    } else {
      this.html = `<nav class="nav">Empty Nav</nav>`;
    }
  }

  setActive(label, status = true) {
    this.options.items = this.options.items.map(item =>
      item.label === label ? {...item, active: status} : item
    );
    this.render(this.options)
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}

class Progress extends Component {
  options = {
    id: Component.generateID(),
    class: "",
    type: "primary",
    value: 0,
    max: 100,
  };

  html = "";

  constructor(options = null) {
    super();
    if (options !== null) {
      this.options = {...this.options, ...options};
    }
    this.render(this.options)
  }

  render(options = null) {
    if (options !== null) {
      this.html = `<div id="${options.id}" class="progress ${options.class}"><div class="progress-bar bg-${options.type}" role="progressbar" style="width: ${options.value}%;" aria-valuenow="${options.value}" aria-valuemin="0" aria-valuemax="${options.max}"></div></div>`;
    } else {
      this.html = `<div class="progress"><div class="progress-bar bg-primary" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>`;
    }
  }

  present() {
    if (this.html !== "") {
      document.querySelector("#srf-app").innerHTML += this.html;
      return this.options.id;
    }
    return "";
  }
}
