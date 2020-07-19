

import Vue from 'vue';

import '../style/bootstrap.min.css';
import '../style/style.scss';

Vue.component('reports-page', {
    render() {
        return <div class="container">
            <h2>דוחות</h2>
            <div>
                <a href="/reports/collection">דוח גביה</a>
            </div>
            <div>
                <a href="/reports/finished">דוח מסתיימים</a>
            </div>
        </div>

    }
});