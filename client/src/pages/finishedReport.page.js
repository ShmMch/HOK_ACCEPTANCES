
import FinishedReportService from '../services/finishedReport.service';
import Vue from 'vue';
import '../components/organizations.component'
import '../components/datePicker.component'
import '../style/bootstrap.min.css';
import '../style/style.scss';

Vue.component('finished-report-page', {
    data: function () {
        return {
            date: '2018-09-09',
            organizations: []
        }
    },
    methods: {
        getOrganizations(date) {
            this.date = date;
            return new FinishedReportService()
                .getOrganizations(date)
                .then(orgs => {
                    this.organizations = orgs;
                })
        }
    },
    render() {
        return <div class="container">
            <h2>
                <span><a href="/reports">דוחות</a></span>
                <span>  ></span>
                <span>דוח מסיימים</span>
            </h2>
            <date-picker change={this.getOrganizations} />
            <organizations organizations={this.organizations} reportDate={this.date} />
        </div>

    }
});