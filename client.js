const { chatProto, grpc } = require("./chatProto");
const readline = require("readline");

const getUser = () => {
  let user;
  if (process.argv.length >= 3) {
    user = process.argv[2];
  } else {
    console.error("Please give us your name!");
    process.exit();
  }

  return user;
};

const enter = (communicate, user) => {
  communicate.write({
    newUser: true,
    user,
  });
};

const receiveMessage = (communicate) => {
  communicate.on("data", ({ newUser, user, text }) => {
    if (newUser) {
      console.log(`${user} is entered!`);
    } else {
      console.log(`[${user}]: ${text}`);
    }
  });
};

const readlineAndSend = (communicate, user) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (input) => {
    communicate.write({
      newUser: false,
      user,
      text: input,
    });
  });
};

const main = () => {
  const user = getUser();

  const client = new chatProto.Chatting(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  const communicate = client.communicate();

  enter(communicate, user);
  receiveMessage(communicate);
  readlineAndSend(communicate, user);
};

main();
