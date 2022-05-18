let cross = document.querySelector("#cross")
let div = document.querySelector(".parentDiv")
cross.addEventListener("click", (e) => {
    e.preventDefault()
    div.style.display = "none"
})