var finishedLoadingAdmins = false;
var adminsArray = [];
var currentUser;

document.addEventListener("DOMContentLoaded", (event) => {
  const db = firebase.firestore();
  const users = db.collection("Users");
  const admins = users.doc("admins");
  admins.get().then((doc) => {
    const data = doc.data();
    for (var i = 0; i < data.uuids.length; i++) {
      adminsArray.push(data.uuids[i]);
    }
    finishedLoadingAdmins = true;
  });

  load_posts();
});

function formatDateWithSuffix(date) {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return (
    date.toLocaleString("en-US", { month: "long" }) +
    " " +
    day +
    suffix +
    ", " +
    date.toLocaleString("en-US", { year: "numeric" })
  );
}

function blog_post(content, title, date) {
  this.title = title;
  this.content = content;
  this.date = date;
}

function go_to_post(post) {
  let posts = document.getElementById("blog-posts");
  posts.classList.add("hide");

  let loaded_post = document.getElementById("loaded-post");
  loaded_post.classList.remove("hide");
  loaded_post.children[1].innerText = post.title;
  loaded_post.children[2].innerHTML = post.content;
  loaded_post.children[3].innerText = formatDateWithSuffix(post.date);
}

function close_post() {
  let posts = document.getElementById("blog-posts");
  posts.classList.remove("hide");

  let loaded_post = document.getElementById("loaded-post");
  loaded_post.classList.add("hide");
}

async function load_posts() {
  let posts = document.getElementById("blog-posts");

  const db = firebase.firestore();
  const snapshot = await db.collection("Posts").get();
  snapshot.forEach((doc) => {
    const data = doc.data();

    var new_post = document.createElement("div");
    new_post.onclick = () =>
      go_to_post(new blog_post(data.content, data.title, data.date.toDate()));

    new_post.classList.add("blog-post");

    var title = document.createElement("div");
    title.classList.add("blog-title");
    title.innerText = data.title;
    new_post.appendChild(title);

    var date = document.createElement("div");
    date.classList.add("blog-date");
    date.innerText = formatDateWithSuffix(data.date.toDate());
    new_post.appendChild(date);

    posts.appendChild(new_post);
  });
}

function user(name, UUID) {
  while (!finishedLoadingAdmins);
  this.name = name;
  this.UUID = UUID;
  for (var i = 0; i < adminsArray.length; i++) {
    this.isAdmin = UUID == adminsArray[i];
    if (this.isAdmin) break;
  }
}

async function login(provider) {
  const result = await firebase.auth().signInWithPopup(provider);
  return new user(result.user.displayName, result.user.uid);
}

async function googleLogin() {
  currentUser = await login(new firebase.auth.GoogleAuthProvider());
  var parent = document.getElementById("login-button").parentElement;
  parent.removeChild(document.getElementById("login-button"));
  var newElement = document.createElement("div");
  newElement.id = "login-name";
  newElement.innerText = "Hello " + currentUser.name;
  parent.appendChild(newElement);

  if (currentUser.isAdmin) {
    document.getElementById("blog-posts").classList.add("hide");
    document.getElementById("create-post").classList.remove("hide");
  }
}
