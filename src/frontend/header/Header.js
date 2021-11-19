import {createElement} from "../utils/domUtils.js";
import CookieManager from "../utils/CookieManager.js";
import './header.css';

export default class Header {
	headerTimeout;
	headerCtrlDown = false;

	constructor(webSocketClient, authManager) {
		const cm = new CookieManager();
		const color = cm.get("backgroundColor") || "#3c5351";
		const displayAbout = cm.get("displayAbout") || "true";
		const connectedTarget = createElement("div", { className:"connectedTarget" }, 0);

		document.body.style.backgroundColor = color;
		this.hideTaskBar = this.hideTaskBar.bind(this);

		let message = createElement("div", { className:"message" });
		let password = createElement("input", { type:"password" });

		let about = createElement("div", { className:"about container" },
			createElement("div", { className:"window" },
				createElement("div", { className:"title" },
					createElement("div", { }, "GIFWall" ),
					createElement("div", { className:"bold" }, "98" )
				),
				createElement("div", { className:"content" },
					createElement("div", { className:"sub" },
						createElement("div", { className:"i" }, "Welcome to the GIFWall, enjoy your eye-aids!")
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"h" }, "Uploading your oh so \"funny\" gif (jpg or png)" ),
						createElement("div", { className:"t" }, "Drag 'n drop your image from the desktop into the GIFWall app")
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"h" },	"Moving an image" ),
						createElement("div", { className:"t" }, "Click on the image and drag it around")
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"h" },	"Scaling an image" ),
						createElement("div", { className:"t" }, "Press"),
						createElement("div", { className:"icon" }, "CTRL"),
						createElement("div", { className:"t" }, "and you see windows appear! In the bottom right hand corner you see"),
						createElement("div", { className:"icon" }, "◲"),
						createElement("div", { className:"t" }, "drag it...NOW!")
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"h" }, "Removing an image" ),
						createElement("div", { className:"t" }, "You're still pressing "),
						createElement("div", { className:"icon" }, "CTRL"),
						createElement("div", { className:"t" }, "right? good. You see the"),
						createElement("div", { className:"icon" }, "🞬"),
						createElement("div", { className:"t" }, "if you press it the gif will be removed and lost for all eternity")
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"h" }, "bringing an image to the front"),
						createElement("div", { className:"t" }, "Is your image covered by other images? Do you not like that? Well we've got good news, press" ),
						createElement("div", { className:"icon" }, "CTRL"),
						createElement("div", { className:"t" }, "click on the image and it will be brought to the front again!" )
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"h" },	"Moving the whole canvas"),
						createElement("div", { className:"t" }, "Click"),
						createElement("div", { className:"icon" }, "MIDDLE-MOUSE BUTTON"),
						createElement("div", { className:"t" }, "You can now drag yourself away from the horrid gifs other people have uploaded!" )
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"t" }, "You can find this help screen under the start button on the header")
					),
					createElement("div", { className:"sub" },
						createElement("div", { className:"label" }, "password"),
						password,
						message
					)
				),
				createElement("div", { className:"button login", onclick:async () => {
						if (password.value !== "") {
							let res = await authManager.requestSessionKey(password.value);
							if (res) {
								about.style.display = "none";
								message.textContent = "";
							} else message.textContent = "password incorrect";
						} else message.textContent = "please input password";
					} }, "Login"),
				createElement("div", { className:"button close", onclick:() => { about.style.display = "none" } }, "Dismiss")
			)
		);

		if (displayAbout === "true") {
			cm.set("displayAbout", "false");
		} else {
			about.style.display = "none";
		}

		let header = createElement("div", { className:"header container down" },
			createElement("div", { className:"button start", onclick:() => { about.style.display = "flex" } }),
			createElement("div", { className:"bar" },
				createElement("div", { className:"title" },
					createElement("div", {}, "GIFWall"),
					createElement("div", { className:"bold" }, "98")
				),
				createElement("div", { className:"menu" },
					createElement("div", { className:"name" }, "Background color:"),
					createElement("input", {
						type:"color",
						value:color,
						oninput:(evt) => { document.body.style.backgroundColor = evt.target.value; cm.set("backgroundColor", evt.target.value) }
					}),
					createElement("div", { className:"name" }, "People connected:"),
					connectedTarget
				)
			)
		);

		window.addEventListener("keydown", (evt) => {
			if (evt.key === "Control") {
				this.headerCtrlDown = true;
				if (this.headerTimeout != null) clearTimeout(this.headerTimeout);
				header.classList.add("down");
			}
		});

		window.addEventListener("keyup", (evt) => {
			if (evt.key === "Control" || this.headerCtrlDown) {
				this.headerCtrlDown = false;
				header.classList.remove("down");
			}
		});

		header.onmouseenter = (evt) => {
			if (this.headerTimeout == null && !this.headerCtrlDown) evt.target.classList.add("down");
			else clearTimeout(this.headerTimeout);
		}
		header.onmouseleave = (evt) => {
			if (!this.headerCtrlDown) this.hideTaskBar(evt.target, 1000);
		}

		document.body.appendChild(header);
		document.body.appendChild(about);
		this.hideTaskBar(header, 3000);

		webSocketClient.on('viewerCountUpdate', (count) => {
			connectedTarget.textContent = count;
		})
	}

	hideTaskBar(target, time) {
		this.headerTimeout = setTimeout(() => {
			target.classList.remove("down");
			this.headerTimeout = null;
		}, time);
	}
}
