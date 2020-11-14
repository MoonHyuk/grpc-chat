const { chatProto, grpc } = require("./chatProto");

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

  const enter = client.enter();
  enter.write({ value: name });

  enter.on("data", function ({ name }) {
    console.log(`User ${name} entered!`);
  });
}

main();
