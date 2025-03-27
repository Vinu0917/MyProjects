var typed = new Typed(".text", {
    strings:["Frontend Developer", "Graphics designer" ,"UI/UX designer"],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
})
document.addEventListener("DOMContentLoaded", function () {
    const projectsWrapper = document.querySelector(".projects-wrapper");
    const scrollLeftBtn = document.querySelector(".scroll-left");
    const scrollRightBtn = document.querySelector(".scroll-right");

    let scrollAmount = 300; // Adjust scroll step

    scrollLeftBtn.addEventListener("click", () => {
        projectsWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    scrollRightBtn.addEventListener("click", () => {
        projectsWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Hide/show buttons based on scroll position
    function updateScrollButtons() {
        scrollLeftBtn.style.display = projectsWrapper.scrollLeft > 0 ? "block" : "none";
        scrollRightBtn.style.display =
            projectsWrapper.scrollLeft + projectsWrapper.clientWidth < projectsWrapper.scrollWidth
                ? "block"
                : "none";
    }

    projectsWrapper.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons(); // Initialize button visibility
});

