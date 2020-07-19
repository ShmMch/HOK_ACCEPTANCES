import Vue from 'vue';

import './pages/reports.page'


const element = document.createElement('div')
element.innerHTML = `<div id="app"><reports-page></reports-page></div>`;
document.body.appendChild(element);


new Vue({
  el: '#app'
})
