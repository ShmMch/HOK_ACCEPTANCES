import Project from './project.model';

export default class Organization {

    constructor(organization, serviceProvider) {
        const { key, name, projects, email } = organization;
        const _projects = projects.map(prj => new Project(Object.assign(prj, { organizaitionKey: key }), serviceProvider));
        Object.assign(this, { key, name, projects: _projects, email });

        this._serviceProvider = serviceProvider;
    }

    downloadFile(reportDate) {
        return this._serviceProvider
            .getReportFile(this.key, reportDate);
    }

    sendEmail(reportDate) {
        return this._serviceProvider
            .sendReportFile(this.key, reportDate);
    }
    downloadProjectFiles() {

    }
}

