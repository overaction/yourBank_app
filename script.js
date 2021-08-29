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

const userId = document.querySelector('.login__id');
const userPwd = document.querySelector('.login__pwd');
const loginBtn = document.querySelector('.login__submit');

const welcomeMsg = document.querySelector('.welcome');
const containerApp = document.querySelector('.app');

const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const transferBtn = document.querySelector('.form__btn--transfer');


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
const calcBalanaceAndDisplay = (account) => {
  account.balance = account.movements.reduce((prev,cur) => prev+cur);
  totalBalance.innerHTML = `₩${account.balance}`;
}

// UI 업데이트
const updateUI = (acc) => {
  displayMovements(acc.movements);
  calcDisplaySummary(acc.movements);
  calcBalanaceAndDisplay(acc);
}

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

// 로그인 기능
let currentAccount;

loginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === userId.value)
  console.log(userId.value);
  console.log(currentAccount)
  if(currentAccount?.pin === Number(userPwd.value)) {
    // 환영 메세지
    welcomeMsg.textContent = `환영합니다! ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    // 정보 표시
    updateUI(currentAccount);
    // clear
    userId.value = userPwd.value = '';
    userId.blur();
    userPwd.blur();
  }
});

// 송금하기
transferBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value)
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  if(receiver && amount > 0 && currentAccount.balance >= amount && receiver?.username !== currentAccount.username) {
    // 전송하기
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    // UI업데이트
    updateUI(currentAccount);
  }
  //clear
  inputTransferAmount.value = inputTransferTo.value = '';
})
