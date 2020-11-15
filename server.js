const { chatProto, grpc } = require("./chatProto");

let users = [];

const communicate = (call) => {
  call.on("data", ({ newUser, user, text }) => {
    if (newUser) {
      users.push(call);
    }

    users.forEach((call) => {
      call.write({ newUser, user, text });
    });
  });
};

const main = () => {
  const server = new grpc.Server();
  server.addService(chatProto.Chatting.service, { communicate });
  server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  server.start();
};

main();
