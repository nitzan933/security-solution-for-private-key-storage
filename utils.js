const { fork } = require('child_process');



const STARTPORT = 6000;
const configs = [
  // Define your different configurations here
  { port: STARTPORT },
  { port: STARTPORT + 1 },
  { port: STARTPORT + 2 },
  { port: STARTPORT + 3 },
  { port: STARTPORT + 4 },
  { port: STARTPORT + 5 },
  { port: STARTPORT + 6 },
  { port: STARTPORT + 7 },
  { port: STARTPORT + 8 },
  { port: STARTPORT + 9 },
  { port: STARTPORT + 10 },
  { port: STARTPORT + 11 },
  { port: STARTPORT + 12 },
  { port: STARTPORT + 13 },
  { port: STARTPORT + 14 },
  { port: STARTPORT + 15 },
  // Add more configurations as needed
];






configs.forEach((config) => {
  const childProcess = fork('./index.js'); // Replace with the path to your program file

  // Send the configuration to the child process
  childProcess.send(config.port);

});
