
window.onscroll = function () { funcaoScroll() };
function funcaoScroll() {
    document.getElementById("myBtn").style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? "block" : "none";
}
function funcaoTopo() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function navigateToPage(pageUrl) {
    window.location.href = pageUrl;
}