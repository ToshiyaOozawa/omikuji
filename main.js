'use strict';

{
  const btn = document.querySelector('#btn');
  const pElement = document.querySelector('#result-text');
  const reset = document.querySelector('#reset');
  const resultTexts = [
    // '神',
    '大吉',
    '中吉',
    '小吉',
    '吉',
    '末吉',
    '凶',
  ];
  const caution = document.querySelector('#caution');
  const timer = document.querySelector('#timer');
  let count = 0;
  let resetCount = 0;
  let reloadCount = 0;

  let endTime;
  let intervalId;
  let d = new Date();
  
  //setIntervalのcallback関数
  function countDown() {
    let limit = endTime - Date.now();

    if ( limit < 0) {
      clearInterval(intervalId);
      limit = endTime;//必要なのか？
      // limit = 3 * 1000;
      timer.textContent = '';
      count = 0;
      resetCount = 0;
      localStorage.removeItem('count');
      localStorage.removeItem('resetcount');
      btn.disabled = false;
      pElement.classList.remove('stop');
      pElement.textContent = '?';
      caution.textContent = '';
      reset.disabled = true;
      return;
    }

    const totalSeconds = Math.floor(limit / 1000);
    const hours = Math.floor(totalSeconds / 60 / 60);
    const minutes = Math.floor(totalSeconds / 60 % 60);
    const seconds = totalSeconds % 60;
    timer.textContent = `再リセットまで ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  }

  //タイマー部分の処理
  function activeTimer() {
    endTime = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    // endTime = Date.now() + 3 * 1000;
    intervalId = setInterval(countDown, 100);
  }

  //ページ読み込み時の挙動
  if (localStorage.getItem('resetcount') > 1) {
    caution.textContent = 'リセットは1日1回や!';
    pElement.classList.add('stop');
    pElement.textContent = 'X';
    btn.disabled = true;
    reset.disabled = true;
    activeTimer();
  } else {
    caution.textContent = '';
    pElement.classList.remove('stop');
    pElement.textContent = '?';
    btn.disabled = false;
    reset.disabled = true;
  }

  //おみくじを引くボタンの挙動
  btn.addEventListener('click', () => {
    count++;
    localStorage.setItem('count', count);
    if (count >= 10) {
      caution.textContent = '何回やんねん!';
      pElement.classList.add('stop');
      pElement.textContent = 'X';
      btn.disabled = true;
      reset.disabled = false;
      return;
    } 
    reset.disabled = false;
    const resultIndex = Math.floor(Math.random() * resultTexts.length);
    pElement.textContent = resultTexts[resultIndex];
    // switch (pElement.textContent) {
    //   case '神':
    //     caution.textContent = '今日はここまで、おめでとう!';
    //     btn.disabled = true;
    //     reset.disabled = true;
    //     break;
    // }
  });

  //resetボタンの挙動
  reset.addEventListener('click', () => {
    if (localStorage.getItem('resetcount') === null) {
      resetCount++;
      localStorage.setItem('resetcount', resetCount);
    } else {
      resetCount = Number(localStorage.getItem('resetcount')) + 1;
      localStorage.setItem('resetcount', resetCount);
    }
    count = 0;
    localStorage.setItem('count', count);
    if (resetCount > 1 || localStorage.getItem('resetcount') > 1) {
      caution.textContent = 'リセットは1日1回や!';
      pElement.classList.add('stop');
      pElement.textContent = 'X';
      localStorage.setItem('count', count);
      localStorage.setItem('resetcount', resetCount);
      btn.disabled = true;
      reset.disabled = true;
      activeTimer();
      return;
    }
    if (btn.disabled) {
      btn.disabled = false;
      pElement.classList.remove('stop');
    }
    pElement.textContent = '?';
    caution.textContent = '';
    reset.disabled = true;
    
  });

  //reload時、各種条件分岐の処理
  window.addEventListener('load', () => {
    if (localStorage.getItem('resetcount') > 1 && localStorage.getItem('reloadcount') === null) {
      reloadCount++;
      localStorage.setItem('reloadcount', reloadCount);
    } else if (localStorage.getItem('resetcount') > 0 && localStorage.getItem('reloadcount') === null && localStorage.getItem('count') > 0) {
      resetCount = Number(localStorage.getItem('resetcount')) + 1;
      localStorage.setItem('resetcount', resetCount);
      caution.textContent = 'リセットは1日1回や!';
      pElement.classList.add('stop');
      pElement.textContent = 'X';
      localStorage.setItem('count', count);
      localStorage.setItem('resetcount', resetCount);
      btn.disabled = true;
      reset.disabled = true;
      activeTimer();
      return;
    } else if (localStorage.getItem('resetcount') === null && localStorage.getItem('reloadcount') === null && localStorage.getItem('count') > 0) {
      resetCount = 1;
      localStorage.setItem('resetcount', resetCount);
      localStorage.removeItem('count');
    } else if (localStorage.getItem('reloadcount') === null) {
      resetCount = 0;
    } else {
      reloadCount = Number(localStorage.getItem('reloadcount')) + 1;
      localStorage.setItem('reloadcount', reloadCount);
    }
    
    //resetタイマー動作中、reloadを2回した際の処理
    if (localStorage.getItem('reloadcount') > 1) {
      resetCount = 0;
      localStorage.removeItem('reloadcount');
      localStorage.removeItem('count');
      localStorage.removeItem('resetcount');
      clearInterval(intervalId);
      timer.textContent = '';
      caution.textContent = '';
      pElement.classList.remove('stop');
      pElement.textContent = '?';
      btn.disabled = false;
    }
  });

}