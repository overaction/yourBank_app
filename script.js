'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'k',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'J',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'S',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'M',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const containerMovements = document.querySelector('.movements');
const totalBalance = document.querySelector('.balance__total');

const summaryIn = document.querySelector('.income');
const summaryOut = document.querySelector('.out');
const summaryInterest = document.querySelector('.yield');

// functions

// 돈의 흐름을 나타냄
const displayMovements = (movements) => {
  movements.forEach((value,idx) => {
    const type = value > 0 ? '입금' : '출금'
    const typeClass = value > 0 ? 'deposit':'withdraw'
    const html = `
    <div class="movement__row">
      <div class="movement__type__${typeClass}">${type} ${idx+1}</div>
      <div class="movement__type__date">12/03/2020</div>
      <div class="movement__type__value">₩${value}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin',html);
  })
}
displayMovements(account1.movements);

// username 생성
const createUsernames = (accs) => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('')
  });
};
createUsernames(accounts);
console.log(accounts);

// 현재 자산을 나타냄
const calcBalanace = (movements) => {
  const balance = movements.reduce((prev,cur) => prev+cur);
  totalBalance.innerHTML = `₩${balance}`;
}

calcBalanace(account1.movements);

// 자산 요약을 나타냄
const calcDisplaySummary = (movements) => {
  const incomes = movements
  .filter(mov => mov > 0)
  .reduce((acum,mov) => acum+mov,0);
  summaryIn.textContent = `₩${incomes}`;

  const outcomes = movements
  .filter(mov => mov < 0)
  .reduce((acum,mov) => acum+mov,0);
  summaryOut.textContent = `₩${Math.abs(outcomes)}`;

  const interests = movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * 1.2 / 100)
  .reduce((acum,mov) => acum+mov,0);
  summaryInterest.textContent = `₩${Math.floor(Math.abs(interests))}`;
}

calcDisplaySummary(account1.movements);