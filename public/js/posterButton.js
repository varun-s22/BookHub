let posterDiv = document.querySelector("#PosterContainer")
let arrowKeys = document.querySelector("#arrowKey")
let bookLink = document.querySelector("#bookLink")
let poster = document.querySelector(".poster")
let bookPosterShelf = [
    { link: "/book/The%20Invisible%20Man", poster: "/images/invisibleMan.png" },
    { link: "/book/Dracula", poster: "/images/dracula.png" },
    { link: "/book/London's%20Heart", poster: "/images/london.png" }
]
let i = 0
arrowKeys.addEventListener("click", (e) => {
    e.preventDefault()
    bookLink.href = bookPosterShelf[i].link
    poster.src = bookPosterShelf[i].poster
    i++
    i = i % bookPosterShelf.length
})