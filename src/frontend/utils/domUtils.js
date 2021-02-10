export function createElement(type, properties, ...children) {
    let element = document.createElement(type);
    for (let prop in properties) {
        element[prop] = properties[prop];
    }
    if (children.length > 0) {
        for (let child of children) {
            let type = typeof child;
            if (type === "string" || type === "number") element.textContent = child;
            else element.appendChild(child);
        }
    }
    return element;
}

export const ImagePromise = (imageUrl) => new Promise((resolve, reject) =>{
    const image = new Image();

    image.onload = () => {
        resolve(image);
    }

    image.onerror = (error) => {
        reject(error);
    }

    image.src = imageUrl;
})
