const PROTO_PATH = __dirname + "/chat.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

let users = [];

function enter(call) {
  call.on("data", function ({ value: name }) {
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
