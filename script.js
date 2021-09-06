'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'k',
  movements: [
    {value: 200, date: '2021-08-17T03:24:00'},
    {value: 450, date: '2021-08-17T03:24:00'},
    {value: -400, date: '2021-08-17T03:24:00'},
    {value: 3000, date: '2021-08-17T03:24:00'},
    {value: -650, date: '2021-08-17T03:24:00'},
    {value: -130, date: '2021-08-17T03:24:00'},
    {value: 70, date: '2021-08-17T03:24:00'},
    {value: 1300, date: '2021-08-17T03:24:00'},
  ],
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
  movements: [
    {value: 200, date: '2021-08-17T03:24:00'},
    {value: 450, date: '2021-08-17T03:24:00'},
    {value: -400, date: '2021-08-17T03:24:00'},
    {value: 3000, date: '2021-08-17T03:24:00'},
    {value: -650, date: '2021-08-17T03:24:00'},
    {value: -130, date: '2021-08-17T03:24:00'},
    {value: 70, date: '2021-08-17T03:24:00'},
    {value: 1300, date: '2021-08-17T03:24:00'},
  ],
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

const logoutUser = document.querySelector('.form__input--user');
const logoutPin = document.querySelector('.form__input--pin');
const logoutBtn = document.querySelector('.form__btn--logout');

const loanAmount = document.querySelector('.form__input--loan-amount');
const loanBtn = document.querySelector('.form__btn--loan');

const sortBtn = document.querySelector('.sortBtn');
const sortList = document.querySelector('.sortMenu__list');
const sortBasicBtn = document.querySelector('.sort__basic');
const sortDepositBtn = document.querySelector('.sort__deposit');
const sortWithdrawBtn = document.querySelector('.sort__withdraw');

const mainDate = document.querySelector('.left__date');
const logoutTimer = document.querySelector('.timer__now');

let currentAccount, timer;

// functions
// 돈의 흐름을 나타냄
const displayMovements = (acc, sort=false) => {
  let movs = acc.movements;
  if(sort == 1) {
    movs = movs.slice().sort((a,b) => a.value-b.value);
  }
  else if(sort == 2) {
    movs = movs.slice().filter(mov => mov.value > 0);
  }
  else if(sort == 3) {
    movs = movs.slice().filter(mov => mov.value < 0);
  }

  containerMovements.textContent = ''

  movs.forEach((value,idx) => {
    const type = value.value > 0 ? '입금' : '출금';
    const typeClass = value.value > 0 ? 'deposit':'withdraw';

    // 날짜
    const now = new Date(value.date);
    const day = now.getDate().toString().padStart(2,0);
    const month = (now.getMonth()+1).toString().padStart(2,0);
    const year = (now.getFullYear()).toString().padStart(2,0);
    const hour = now.getHours().toString().padStart(2,0);
    const min = now.getMinutes().toString().padStart(2,0);

    const html = `
    <div class="movement__row">
      <div class="movement__type__${typeClass}">${type} ${idx+1}</div>
      <div class="movement__type__date">${year}-${month}-${day} ${hour}:${min}</div>
      <div class="movement__type__value">₩${value.value}</div>
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
  const temp = account.movements.map(val => val.value);
  account.balance = temp.reduce((prev,cur) => prev+cur);
  totalBalance.innerHTML = `₩${account.balance}`;
}

// UI 업데이트
const updateUI = (acc) => {
  displayMovements(acc);
  calcDisplaySummary(acc.movements);
  calcBalanaceAndDisplay(acc);
}

// 로그아웃 타이머
const startLogoutTimer = () => {
  let time = 300;
  const tick = () => {
    const min = (Math.floor(time / 60)).toString().padStart(2,0);
    const sec = (Math.floor(time % 60)).toString().padStart(2,0)
    logoutTimer.textContent = `${min}:${sec}`;

    if(time == 0) { 
      clearInterval(timer);
      containerApp.style.opacity = 0;
      welcomeMsg.textContent = "로그인 후 이용해주세요"
    }
    time -= 1;
  }
  tick();
  timer = setInterval(tick,1000);

  return timer;
}

// 자산 요약을 나타냄
const calcDisplaySummary = (movements) => {
  const incomes = movements
  .filter(mov => mov.value > 0)
  .reduce((acum,mov) => acum+mov.value,0);
  summaryIn.textContent = `₩${incomes}`;

  const outcomes = movements
  .filter(mov => mov.value < 0)
  .reduce((acum,mov) => acum+mov.value,0);
  summaryOut.textContent = `₩${Math.abs(outcomes)}`;

  const interests = movements
  .filter(mov => mov.value > 0)
  .map(deposit => deposit.value * 1.2 / 100)
  .reduce((acum,mov) => acum+mov,0);
  summaryInterest.textContent = `₩${Math.floor(Math.abs(interests))}`;
}

// 날짜 표시
const now = new Date();
const day = now.getDate().toString().padStart(2,0);
const month = (now.getMonth()+1).toString().padStart(2,0);
const year = (now.getFullYear()).toString().padStart(2,0);
const hour = now.getHours().toString().padStart(2,0);
const min = now.getMinutes().toString().padStart(2,0);

mainDate.textContent = `현재시각 ${year}/${month}/${day}, ${hour}:${min}`;

// 로그인 하기
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
    // 타이머
    if(timer) clearInterval(timer);
    timer = startLogoutTimer();
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
    const now = new Date();
    currentAccount.movements.push({value:-amount, date: now});
    receiver.movements.push({value: amount, date: now});
    // UI업데이트
    updateUI(currentAccount);
    // 타이머 재시작
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  //clear
  inputTransferAmount.value = inputTransferTo.value = '';
})

// 빌리기
loanBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(loanAmount.value);
  if(amount > 0 && currentAccount?.movements.some(mov => mov.value >= amount*0.1)) {
    currentAccount.movements.push({value:amount, date: now});

    updateUI(currentAccount);
    // 타이머 재시작
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  loanAmount.value = '';
})

// 로그아웃
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(currentAccount.username === logoutUser.value && currentAccount.pin === Number(logoutPin.value)) {
    const accIdx = accounts.findIndex(acc => acc.username === currentAccount.username);
    
    accounts.splice(accIdx,1);
    containerApp.style.opacity = 0;
  }
  logoutPin.value = logoutUser.value = '';
})


// 정렬 기능
let sorted = false;
sortBtn.addEventListener('click', (e) => {
  sortList.classList.toggle('visibility');
})

// 기본정렬
sortBasicBtn.addEventListener('click',(e) => {
  displayMovements(currentAccount,1);
});

// 입금내역
sortDepositBtn.addEventListener('click',(e) => {
  displayMovements(currentAccount,2);
});

// 출금내역
sortWithdrawBtn.addEventListener('click',(e) => {
  displayMovements(currentAccount,3);
});
