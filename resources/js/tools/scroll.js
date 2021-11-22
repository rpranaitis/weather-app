import {rightSide, scrollToTopButton} from "../selectors";

export function scrollToCity() {
    document.documentElement.scrollTop = rightSide.offsetTop;
}

export function scrollFunction() {
    let position = rightSide.offsetTop + 20;

    if (document.body.scrollTop > position || document.documentElement.scrollTop > position) {
        scrollToTopButton.classList.add('active');
    } else {
        scrollToTopButton.classList.remove('active');
    }
}

export function scrollToTop() {
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}