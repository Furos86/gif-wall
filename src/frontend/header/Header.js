import {createElement} from "../utils/domUtils.js";
import CookieManager from "../utils/CookieManager.js";
import './header.css';

export default class Header {
	headerTimeout;
	headerCtrlDown = false;

	constructor(webSocketClient) {
		const cm = new CookieManager();
		const color = cm.get("backgroundColor") || "#3c5351";
		const connectedTarget = createElement("div", { className:"connectedTarget" }, 0);

		document.body.style.backgroundColor = color;
		this.hideTaskBar = this.hideTaskBar.bind(this);

		let header = createElement("div", { className:"header container down" },
			createElement("div", { className:"button start" }),
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
						oninput:(evt) => {
							document.body.style.backgroundColor = evt.target.value;
							cm.set("backgroundColor", evt.target.value)
						}
					}),
					createElement("div", { className:"name" }, "People connected:"),
					connectedTarget
				)
			)
		)

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
