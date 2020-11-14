const { chatProto, grpc } = require("./chatProto");

let users = [];

function enter(call) {
  call.on("data", ({ value: name }) => {
    const newUser = {
      id: users.length + 1,
      name,
    };

    users.push({ ...newUser, call });
    users.forEach(({ call }) => {
      call.write(newUser);
    });
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(chatProto.Chatting.service, { enter });
  server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
