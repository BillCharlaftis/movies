// ██╗████████╗██████╗  ██╗███████╗██████╗  ██╗ ██████╗
// ██║╚══██╔══╝██╔══██╗███║╚════██║╚════██╗███║██╔═████╗
// ██║   ██║   ██████╔╝╚██║    ██╔╝ █████╔╝╚██║██║██╔██║
// ██║   ██║   ██╔═══╝  ██║   ██╔╝ ██╔═══╝  ██║████╔╝██║
// ██║   ██║   ██║      ██║   ██║  ███████╗ ██║╚██████╔╝
// ╚═╝   ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚══════╝ ╚═╝ ╚═════╝

class movie {
    constructor(id, rating, title, category) {
        this.id = id;
        this.rating = rating;
        this.title = title;
        this.category = category;
    }
}

class user {
    constructor(id) {
        this.id = id;
        this.movieratings = [];//movies
        this.usersWithCommons = [];//users
        this.similarityWithRoot = 1;
    }

    add2Movieratings(movie) {
        // for(var i=0; i<this.movieratings; i++){
        //     if(this.movieratings[i].id===movie.id){
        //         this.movieratings[i]=movie;
        // return;
        // }
        // }
        this.movieratings.push(movie);
    }

    movieJson2Array(json) {
        this.movieratings = [];

        for (let i = 0; i < json.length; i++) {
            this.add2Movieratings(new movie(json[i].movieId, json[i].rating, json[i].title, json[i].genres));
        }
        // console.log("user " + this.id + " has rate " + this.movieratings.length + " movies");
    }

    recomentMovies(howMany) {
        this.usersWithCommons = this.usersWithCommons.sort(function (a, b) {
            return b.similarityWithRoot - a.similarityWithRoot
        });

        if (howMany > this.usersWithCommons.length) {
            howMany = this.usersWithCommons.length;
        }

        let recoments = [];

        for (let i = 0; i < howMany; i++) {
            recoments.push(JSON.stringify(this.usersWithCommons[i].movieratings.sort(function (a, b) {
                return b.rating - a.rating
            })[0]));
        }

        return recoments;
    }

    recommenderFindUsers(array) {
        for (let i = 0; i <5; i++) {
            this.usersWithCommons.push(new user(array[i].userId));
            reguest.getUserRatedMovies(array[i].userId, this);
        }
    }

    recommenderFindUsersMovies(json, userId) {
        for (let i = 0; i < this.usersWithCommons.length; i++) {
            if (this.usersWithCommons[i].id === userId) {
                this.usersWithCommons[i].movieJson2Array(json);
            }
        }
        if (resultsResearch === 0) {
            document.getElementById("Sgtn").style.visibility = "visible";
        }
    }

    calcSimilarity(User2) {
        let longestArray = 0;
        let shortestArray = 0;

        if ((this.movieratings.length === User2.movieratings.length) || (this.movieratings.length > User2.movieratings.length)) {
            longestArray = this.movieratings.reduce(function (map, obj) {
                map[obj.id] = obj.rating;
                return map;
            }, {});

            shortestArray = User2.movieratings;
        } else {
            longestArray = User2.movieratings.reduce(function (map, obj) {
                map[obj.id] = obj.rating;
                return map;
            }, {});
            shortestArray = this.movieratings;
        }

        let x = [];
        let y = [];
        let xy = [];
        let x2 = [];
        let y2 = [];

        for (let i = 0; i < shortestArray.length; i++) {
            if (longestArray[shortestArray[i].id] !== undefined) {
                x.push(shortestArray[i].rating);
                y.push(longestArray[shortestArray[i].id]);
                xy.push(shortestArray[i].rating * longestArray[shortestArray[i].id]);
                x2.push(shortestArray[i].rating * shortestArray[i].rating);
                y2.push(longestArray[shortestArray[i].id] * longestArray[shortestArray[i].id]);
            }
        }

        if (shortestArray.length > 0) {
            let sum_x = parseFloat(0);
            let sum_y = parseFloat(0);
            let sum_xy = parseFloat(0);
            let sum_x2 = parseFloat(0);
            let sum_y2 = parseFloat(0);

            for (let i = 0; i < x.length; i++) {
                sum_x += parseFloat(x[i]);
                sum_y += parseFloat(y[i]);
                sum_xy += parseFloat(xy[i]);
                sum_x2 += parseFloat(x2[i]);
                sum_y2 += parseFloat(y2[i]);
            }

            let step1 = parseFloat((x.length * sum_xy) - (sum_x * sum_y));
            let step2 = parseFloat((x.length * sum_x2) - (sum_x * sum_x));
            let step3 = parseFloat((x.length * sum_y2) - (sum_y * sum_y));
            let step4 = Math.sqrt(step2 * step3);

            let answer = 0;

            if ((step1 === 0) || (step2 === 0)) {
            } else {
                answer = step1 / step4;
                //console.log(User2.id + " similarity " + answer);
            }
            User2.similarityWithRoot = answer;
            //console.log(User2.id+" : "+User2.similarityWithRoot);
        } else {
            User2.similarityWithRoot = -1;
        }
    }
}

class view {
    static initEnviroment() {
        this.createSearchInput();
        reguest.searchArray({"keyword": "Dracula"}, this);
        this.currentUser = new user('itp17210');
        return this;
    }

    static createSearchInput() {
        let self = this;

        let wrapper = document.createElement("div");
        wrapper.id = "searchWrap";
        wrapper.style.backgroundColor = "#5f5f5f";
        wrapper.style.width = "100vw";
        wrapper.style.padding = "8px 8px 8px";
        wrapper.style.position = "fixed";
        wrapper.style.top = "0";
        wrapper.style.left = "0";
        wrapper.style.zIndex = 1000;
        wrapper.style.borderBottom = " 5px inset #4CAF50";

        wrapper.appendChild(this.makeLogo());

        let search = document.createElement("INPUT");
        search.setAttribute("type", "search");
        search.style.width = "10vw";
        search.style.minWidth = "10vw";
        search.style.maxWidth = "40vw";
        search.style.fontSize = "14px";
        search.style.backgroundColor = "white";
        search.style.padding = "8px 8px 8px ";
        search.style.border = "none";
        search.placeholder = "Search...";

        search.addEventListener("mouseover", function (e) {
            if (e.target.value === "") {
                self.searchExpander(e.target, 30);
            }
        }, false);

        search.addEventListener("mouseout", function (e) {
            if (e.target.value === "") {
                self.searchReducer(e.target, 30);
            }
        });

        search.addEventListener("keyup", function (e) {
            e.preventDefault();
            if (search.value.length >= 2) {
                if (e.keyCode === 13) {
                    reguest.searchArray({"keyword": search.value}, self);
                }
            }
        });

        search.style.display = "inline";
        wrapper.appendChild(search);

        let searchButton = this.createButton("🔍");
		//searchButton.style.fontSize = "12px";


        searchButton.addEventListener("click", function () {
            if (search.value.length >= 2) {
                reguest.searchArray({"keyword": search.value}, self);
            } else {
                let alert = new customAlert("Too Small Title", "OK", "Please provide a title at least 2 characters long...");
                alert.alert(self.currentUser);
            }
        });

        wrapper.appendChild(searchButton);

        let Suggest = this.createButton("Suggestions ⏭");
        Suggest.id = "Sgtn";
        Suggest.style.left = "85vw";
        Suggest.style.position = "fixed";
        Suggest.style.zIndex = 1000;
        Suggest.style.top = "90vh";
        Suggest.style.fontSize = "25px";
        Suggest.style.background = "none";
        Suggest.style.visibility = "hidden";


        Suggest.addEventListener("click", function (e) {
            //console.log("Clicked!");
            for (let i = 0; i < self.currentUser.usersWithCommons.length; i++) {
                self.currentUser.calcSimilarity(self.currentUser.usersWithCommons[i]);
            }
            new customAlert("Suggestions :", "OK", "Please wait...").alert(self.currentUser);
        });

        Suggest.addEventListener("mouseover", function (e) {
            e.target.style.fontSize = "30px";
        });

        Suggest.addEventListener("mouseout", function (e) {
            e.target.style.fontSize = "25px";
        });

        document.body.appendChild(Suggest);
        document.body.appendChild(wrapper);
    }

    static makeLogo() {
        let wrap = document.createElement("div");
        let logo = document.createElement("pre");

        logo.appendChild(document.createTextNode(" ██╗████████╗██████╗  ██╗███████╗██████╗  ██╗ ██████╗"));
        logo.appendChild(document.createElement("br"));
        logo.appendChild(document.createTextNode(" ██║╚══██╔══╝██╔══██╗███║╚════██║╚════██╗███║██╔═████╗"));
        logo.appendChild(document.createElement("br"));
        logo.appendChild(document.createTextNode(" ██║   ██║   ██████╔╝╚██║    ██╔╝ █████╔╝╚██║██║██╔██║"));
        logo.appendChild(document.createElement("br"));
        logo.appendChild(document.createTextNode(" ██║   ██║   ██╔═══╝  ██║   ██╔╝ ██╔═══╝  ██║████╔╝██║"));
        logo.appendChild(document.createElement("br"));
        logo.appendChild(document.createTextNode(" ██║   ██║   ██║      ██║   ██║  ███████╗ ██║╚██████╔╝"));
        logo.appendChild(document.createElement("br"));
        logo.appendChild(document.createTextNode(" ╚═╝   ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚══════╝ ╚═╝ ╚═════╝"));

        logo.style.fontSize = "5px";
        logo.style.width = "170px";
        logo.style.color = "#A5D7A7";

        wrap.appendChild(logo);
        // wrap.style.width = "222px";
        wrap.style.float = "right";
        wrap.style.paddingRight = "5vw";

        return wrap;
    }

    static createButton(text) {
        let Button = document.createElement("button");
        Button.appendChild(document.createTextNode(text));
        Button.style.fontSize = "14px";
        Button.style.backgroundColor = "white";
        Button.style.padding = "8px 8px 8px ";
        Button.style.display = "inline";
        Button.style.border = "none";

        return Button;
    }

    static searchExpander(element, endSize) {
        let width = Number(element.style.width.replace('vw', ''));
        let expandRate = 0.5;
        let time = endSize * 2;
        let i = 0;

        let timer = setInterval(function () {
            width = width + expandRate;

            if ((i < time)) {
                i++;
                element.style.width = width + 'vw';
            } else {
                clearInterval(timer);
            }
        }, 1);
    }

    static searchReducer(element, endSize) {
        let width = Number(element.style.width.replace('vw', ''));
        let collapseRate = 0.5;
        let time = endSize * 4;
        let i = 0;

        let timer = setInterval(function () {
            width = width - collapseRate;

            if ((i < time)) {
                i++;
                element.style.width = width + 'vw';
            } else {
                clearInterval(timer);
            }
        }, 1);
    }

    static updateResultTable(json) {
        let results = document.getElementById("results");

        if (results === null) {
            results = document.createElement("table");
            results.id = "results";
        } else {
            results = this.clearTable(results);
        }

        results.style.position = "absolute";
        results.style.top = "9vh";

        updateContext(this);

        for (let i = 0; i < json.length; i++) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");

            td.id = i;
            td.style.height = "10vh";
            td.style.width = "100vw";
            td.style.paddingLeft = "25vw";

            if (i % 2 === 1) {
                td.style.backgroundColor = "#DCDCDC";
            }

			let removeFromList = this.createButton("X");
			removeFromList.style.float = "right";
			removeFromList.style.background = "none";

			let self = this;
			removeFromList.addEventListener("click", function(e){
				json.splice(e.target.parentNode.id, 1);
				self.updateResultTable(json);
			});

			removeFromList.addEventListener("mouseover", function(e){
				removeFromList.style.color = "red";
			});

			removeFromList.addEventListener("mouseout", function (e) {
				removeFromList.style.color = "black";
			});
			td.appendChild(removeFromList);

            td.appendChild(this.createParagraph(json[i].title));
            this.creteStars(td, json[i]);
            tr.appendChild(td);
            results.appendChild(tr);
        }
        document.body.appendChild(results);
    }

    static clearTable(table) {
        let tableHeaderRowCount = 0;
        let rowCount = table.rows.length;
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
        return table;
    }

    static createParagraph(text) {
        let p = document.createElement("p");

        p.appendChild(document.createTextNode(text));
        p.style.textAlign = "center";
        p.style.width = "50vw";
        p.value = "false";//not selected

        return p;
    }

    //★★★★★☆☆☆☆☆
    static creteStars(element, json) {
        let self = this;
        let wrapper = document.createElement("div");
        wrapper.style.marginLeft = "22vw";
        wrapper.textAlign = "center";
        wrapper.id = "rating";
        wrapper.value = 0;

        for (let i = 0; i < 5; i++) {
            let star = this.createParagraph("☆");
            star.id = i;
            star.style.display = "inline";
            star.style.fontSize = "25";

            star.addEventListener("mouseover", function (e) {

                for (let bros = -1; bros < e.target.id; bros++) {
                    if (e.target.value === "false") {
                        wrapper.childNodes[bros + 1].innerText = "★";
                    } else {
                        wrapper.childNodes[bros + 1].innerText = "☆";
                    }
                }
            });

            star.addEventListener("mouseout", function (e) {
                for (let bros = wrapper.value; bros < 5; bros++) {
                    wrapper.childNodes[bros].innerText = "☆";
                }
            });

            star.addEventListener("click", function (e) {
                wrapper.value = Number(e.target.id) + 1;
                let film = new movie(json.movieId, wrapper.value, json.title, json.genres);
                self.currentUser.add2Movieratings(film);
                //console.log("user " + self.currentUser.id + " has rate " + self.currentUser.movieratings.length + " movies");
                resultsResearch++;
                document.getElementById("Sgtn").style.visibility = "hidden";
                reguest.moviesRatePerUser(film, self.currentUser);
            });
            wrapper.appendChild(star);
        }

        wrapper.style.visibility = "hidden";

        element.addEventListener("mouseover", function (e) {
            wrapper.style.visibility = "visible";
        });

        element.addEventListener("mouseout", function (e) {
            wrapper.style.visibility = "hidden";
        });

        element.appendChild(wrapper);
    }
}

class reguest {
    static searchArray(sendData, context) {
        let xhr = new XMLHttpRequest();
        let url = "/movie";
        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function (e) {
            if (e.target.readyState === 4 && e.target.status === 200) {
                let returnedJson = JSON.parse(xhr.responseText);
                context.updateResultTable(returnedJson);
            }
        };
        console.log("POST movie");
        xhr.send(JSON.stringify(sendData));
    }

    static moviesRatePerUser(movie, context) {
        let xhr = new XMLHttpRequest();
        let url = "/ratings";
        xhr.open("post", url, true);
        xhr.setRequestHeader('Content-type', "application/json");

        xhr.onreadystatechange = function (e) {
            if (e.target.readyState === 4 && e.target.status === 200) {
                let returnedJson = JSON.parse(xhr.responseText);
                context.recommenderFindUsers(returnedJson);
                resultsResearch--;
            }
        };
        console.log("POST ratings");
        xhr.send(JSON.stringify({movieList: [movie.id]}));
    }

    static getUserRatedMovies(UserId, context) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                context.recommenderFindUsersMovies(JSON.parse(xhr.responseText), UserId);
            }
        };
        console.log("GET ratings");
        xhr.open("GET", "/ratings" + UserId, true);
        xhr.send(null);
    }

    static getTitles(context, array) {
        for (let i = 0; i < array.length; i++) {
            let id = JSON.parse(array[i]).id;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let json = JSON.parse(xhr.responseText);
                    context.addMovie(new movie(json[0].movieId, "?", json[0].title, json[0].genres), i);
                }
            };
            console.log("GET movie");
            xhr.open("GET", "/movie" + id, true);
            xhr.send(null);
        }
    }
}

class customAlert {
    constructor(ALERT_TITLE, ALERT_BUTTON_TEXT, ALERT_MESSAGE) {
        this.ALERT_TITLE = ALERT_TITLE;
        this.ALERT_BUTTON_TEXT = ALERT_BUTTON_TEXT;
        this.ALERT_MESSAGE = ALERT_MESSAGE;
    }

    createModal() {
        if (document.getElementById("modalContainer")) {
            return;
        }

        let modalContainer = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
        modalContainer.id = "modalContainer";
        modalContainer.style.height = document.documentElement.scrollHeight + "px";
        modalContainer.style.backgroundColor = "rgba(95,95,95, 0.8)";
        modalContainer.style.position = "absolute";
        modalContainer.style.width = "100vw";
        modalContainer.style.height = "100vh";
        modalContainer.style.top = "0vh";
        modalContainer.style.left = "0vw";
        modalContainer.style.zIndex = "10000";
        modalContainer.style.position = "fixed";

        return modalContainer;
    }

    createAlertBox(modalContainer) {
        let alertBox = modalContainer.appendChild(document.createElement("div"));
        alertBox.id = "alertBox";
        alertBox.style.position = "relative";
        alertBox.style.width = "25vw";
        alertBox.style.textAlign = "center";
        alertBox.style.minHeight = "100px";
        alertBox.style.marginTop = "50px";
        alertBox.style.border = "1px solid #666";
        alertBox.style.backgroundColor = "#fff";
        alertBox.style.backgroundRepeat = "no-repeat";
        alertBox.style.backgroundPosition = "20px 30px";
        // alertBox.style.style.position = "fixed";

        if (document.all && !window.opera) {
            alertBox.style.top = document.documentElement.scrollTop + "px";
        }

        alertBox.style.left = (document.documentElement.scrollWidth - alertBox.offsetWidth) / 2 + "px";
        alertBox.style.visiblity = "visible";

        return alertBox;
    }

    createHeader() {
        let h1 = document.createElement("h1");
        h1.appendChild(document.createTextNode(this.ALERT_TITLE));
        h1.style.margin = "0";
        h1.style.font = "bold 0.9em verdana,arial";
        h1.style.backgroundColor = "#A5D7A7";
        h1.style.color = "#FFF";
        h1.style.borderBottom = "1px solid #000";
        h1.style.padding = "2px 0 2px 5px";

        return h1;
    }

    createCloseBtn(self, alertBox) {
        let closeBtn = alertBox.appendChild(document.createElement("a"));
        closeBtn.id = "closeBtn";
        closeBtn.appendChild(document.createTextNode(this.ALERT_BUTTON_TEXT));
        closeBtn.href = "#";
        closeBtn.focus();
        closeBtn.style.display = "block";
        closeBtn.style.position = "relative";
        closeBtn.style.margin = "5px auto";
        closeBtn.style.padding = "7px";
        closeBtn.style.border = "0 none";
        closeBtn.style.width = "70px";
        closeBtn.style.font = "0.7em verdana,arial";
        closeBtn.style.textTransform = "uppercase";
        closeBtn.style.textAlign = "center";
        closeBtn.style.color = "#FFF";
        closeBtn.style.backgroundColor = "#A5D7A7";
        closeBtn.style.borderRadius = "3px";
        closeBtn.style.textDecoration = "none";

        closeBtn.addEventListener("click", function () {
            self.removeCustomAlert();
            return false;
        });
        return closeBtn;
    }

    alert(currentUser) {
        this.Suggestion = 0;
        let self = this;

        let modalContainer = self.createModal();
        let alertBox = self.createAlertBox(modalContainer);
        alertBox.appendChild(self.createHeader());

        let par = alertBox.appendChild(document.createElement("p"));
        par.id = "hide";
        par.appendChild(document.createTextNode(self.ALERT_MESSAGE));

        this.table = alertBox.appendChild(document.createElement("table"));
        let array = currentUser.recomentMovies(5);

        reguest.getTitles(self, array);

        alertBox.appendChild(self.createCloseBtn(self, alertBox));
    }

    addMovie(movie) {
        this.Suggestion++;
        let tr = document.createElement("tr");
        let td = document.createElement("td");

        // console.log(movie);

        document.getElementById("hide").style.display = "none";

        td.style.height = "10vh";
        td.style.textAlign = "center";
        td.style.width = "25vw";

        if (this.Suggestion % 2 === 1) {
            td.style.backgroundColor = "#DCDCDC";
        }

        let par = alertBox.appendChild(document.createElement("p"));
        par.appendChild(document.createTextNode(movie.title));

        td.appendChild(par);
        tr.appendChild(td);
        this.table.appendChild(tr);
    }

    removeCustomAlert() {
        this.Suggestion = 0;
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
    }
}

let context;
let resultsResearch = 0;

function init() {
    context = view.initEnviroment();
}

function updateContext(cont) {
    context = cont;
}

window.addEventListener('load', function () {
    init();
});
