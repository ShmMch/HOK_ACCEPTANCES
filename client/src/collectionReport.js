import Vue from 'vue';

import './pages/collectionReport.page';


const element = document.createElement('div')
element.innerHTML = `<div id="app"><collection-report-page></collection-report-page></div>`;
document.body.appendChild(element);


new Vue({
  el: '#app'
})
