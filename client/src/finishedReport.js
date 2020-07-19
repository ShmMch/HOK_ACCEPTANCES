import Vue from 'vue';

import './pages/finishedReport.page'


const element = document.createElement('div')
element.innerHTML = `<div id="app"><finished-report-page></finished-report-page></div>`;
document.body.appendChild(element);


new Vue({
  el: '#app'
})
