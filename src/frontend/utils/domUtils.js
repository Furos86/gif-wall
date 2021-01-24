export function createElement(tagName, id) {
    const el = document.createElement(tagName);
    el.id = id;
    return el;
}
