export function createElement(tagName, id) {
    const el = document.createElement(tagName);
    el.id = id;
    return el;
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
