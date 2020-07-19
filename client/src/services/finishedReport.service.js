import FetchHandler from './fetchHandler';
import Organization from '../models/organization.model';
export default class CollectionReportService {
    constructor() {

        this._serviceAddress = '/reports/finished/api'

        if (window.location.hostname == 'localhost')
            this._serviceAddress = 'http://localhost:3000/reports/finished/api';

        this._fetchHandler = new FetchHandler();
    }

    _downloadFile(file) {
        const { fileName, content } = file;
        const blob = new Blob([new Uint8Array(content.data)]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    }

    getOrganizations(reportDate) {
        var servicePath = `${this._serviceAddress}/organization?date=${reportDate}`;
        return this._fetchHandler
            .fetch(servicePath)
            .then(orgs => orgs.sort((c1, c2) => c1.name.localeCompare(c2.name)))
            .then(orgs => orgs.map(org => new Organization(org, this)));

    }

    getReportFile(organizationKey, reportDate) {
        var servicePath = `${this._serviceAddress}/${organizationKey}?date=${reportDate}`;
        return this._fetchHandler
            .fetch(servicePath)
            .then(this._downloadFile);


    }

    sendReportFile(organizationKey, reportDate) {
        var servicePath = `${this._serviceAddress}/${organizationKey}?date=${reportDate}`;
        return this._fetchHandler.fetch(servicePath, {
            method: 'POST'
        }).then(console.log);

    }

    getProjectReportFile(organizationKey, projectKey, reportDate) {
        var servicePath = `${this._serviceAddress}/${organizationKey}/${projectKey}?date=${reportDate}`;
        return this._fetchHandler
            .fetch(servicePath)
            .then(this._downloadFile);


    }

    sendProjectReportFile(organizationKey, projectKey, reportDate) {
        var servicePath = `${this._serviceAddress}/${organizationKey}/${projectKey}?date=${reportDate}`;
        return this._fetchHandler.fetch(servicePath, {
            method: 'POST'
        }).then(console.log);

    }

}