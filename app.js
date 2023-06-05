const readline = require('readline');
const { display, add, update, deletem, search, filter } = require('./movieManagement');//import the methods

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function Menu() {
  console.log('=== welcome to project3 ===');
  console.log('1. Display Movies:');
  console.log('2. Add ');
  console.log('3. Update ');
  console.log('4. Delete ');
  console.log('5. Search ');
  console.log('6. Filter ');
  console.log('7. exit');
  console.log('Done by Rami');
}

function promptUserInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function handleUserInput() {
  Menu();
  const choice = await promptUserInput('Enter your choice: ');//i needed await to let the view render and take its time

  switch (choice) {
    case '1':
      display();
      break;
    case '2':
      await add();
      break;
    case '3':
      await update();
      break;
    case '4':
      await deletem();
      break;
    case '5':
      await search();
      break;
    case '6':
      await filter();
      break;
    case '7':
      rl.close();
      process.exit(0);
    default:
      console.log('Invalid choice. Please try again.');
  }

  handleUserInput();
}

handleUserInput();
