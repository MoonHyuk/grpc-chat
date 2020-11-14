const PROTO_PATH = __dirname + "/chat.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { exit } = require("process");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

function main() {
  const client = new chatProto.Chatting(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  if (process.argv.length >= 3) {
    name = process.argv[2];
  } else {
    console.error("Please give us your name!");
    return;
  }

  client.enter({ value: name }, function (err, response) {
    const user = response;
    console.log(`Wellcome ${response.name}!`);
  });
}

main();
