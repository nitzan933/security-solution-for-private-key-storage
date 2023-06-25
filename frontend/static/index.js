import checkOutBalance from "./views/checkOutBalance.js";
import insertPrivateKey from "./views/insertPrivateKey.js";
import makeNewTransaction from "./views/makeNewTransaction.js";

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}
const router = async () => {
    const routes = [
        // { path: "/", view: () => console.log("home") },
        { path: "/makeNewTransaction", view: makeNewTransaction},
        { path: "/checkOutBalance", view: checkOutBalance},
        { path: "/insertPrivateKey", view: insertPrivateKey },
    ];
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        };
    });
    let match = potentialMatches.find(potentialMatches => potentialMatches.isMatch);
    if(!match){
        match = {
            route: routes[0], 
            isMatch: true
        };
    }
    const view = new match.route.view();
    document.querySelector("#app").innerHTML = await view.getHtml();
    var script= document.createElement("script");
    script.src = "/static/utils.js";
    document.head.appendChild( script );
};

document.addEventListener("DOMContentLoaded", () => {
    router();
});



       
