const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();

function formatMessage(username, text) {
  return {
    username,
    text,
    time: `${hours} : ${minutes}`,
  };
}

module.exports = formatMessage;
