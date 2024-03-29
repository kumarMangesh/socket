const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const userList = document.getElementById("users");

// Get username from URL

const params = new URL(document.location).searchParams;
const username = params.get("username");

const socket = io();

// Join user
socket.emit("joinUser", { username });

// Get users
socket.on("totalUsers", ({ users }) => {
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username?.username || "";
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveChat = confirm("Are you sure you want to leave the chat?");
  if (leaveChat) {
    window.location = "../index.html";
  } else {
  }
});
