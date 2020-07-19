

import CollectionReportService from '../services/collectionReport.service';
import Vue from 'vue';
import '../components/organizations.component'
import '../components/datePicker.component'
import '../style/bootstrap.min.css';
import '../style/style.scss';

Vue.component('collection-report-page', {
    data: function () {
        return {
            date: '2018-09-09',
            organizations: []
        }
    },
    methods: {
        getOrganizations(date) {
            this.date = date;
            return new CollectionReportService()
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
                <span> דוח גביה</span>
            </h2>
            <date-picker change={this.getOrganizations} />
            <organizations organizations={this.organizations} reportDate={this.date} />
        </div>

    }
});