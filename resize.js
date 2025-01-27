const a = document.querySelector('.container-left-main');
const b = document.querySelector('.container-left-rateinfo');
let flag = false;
a.addEventListener('mousedown', e=>{
    flag = true;
})
window.addEventListener('mousemove', e=>{
    if (flag) {
      b.style.height = `calc(100% - ${a.style.height})`;	
  }
})
window.addEventListener('mouseup', e=>{
    flag = false;
})