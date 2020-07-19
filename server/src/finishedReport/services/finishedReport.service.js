
import nodemailer from 'nodemailer';

import FinishedReportGenerator from '../core/finishedReportGenerator'
import OrganizationReader from '../../dataAccess/organizationReader';
import ProjectReader from '../../dataAccess/projectReader';
import ProgramReader from '../../dataAccess/programReader';
import dateForamt from 'dateFormat'
export default class FinishedReportService {
    constructor() {

        this.organizationReader = new OrganizationReader();
        const { MAILADDRESS: mailAddress, MAILPASS: mailPassword } = process.env;
        this.transporter = nodemailer.createTransport(`smtp://${mailAddress}:${mailPassword}@smtp.gmail.com`);
    }


    postReportFile(organizationKey, date) {
        const getReportPromise = this.getReportFile(organizationKey, date);
        const getOrganizationsPromise = this.organizationReader.getOrganization(organizationKey)

        return Promise.all([getOrganizationsPromise, getReportPromise])
            .then(([organization, file] = data) => {
                return this.transporter.sendMail({
                    from: '"שירותי מחשב" <aa@gmail.com>',
                    to: organization.email,
                    subject: `דוח מסיימים ליום ${date}`,
                    body: 'mail content...',
                    attachments: [{ filename: file.fileName, content: file.content }]
                });
            })
    }

    getReportFile(organizationKey, date) {
        const getOrganizationPromise = this.organizationReader.getOrganization(organizationKey);
        return getOrganizationPromise
            .then(organization => {
                const finishedReportGenerator = new FinishedReportGenerator(organization, date);
                return Promise.all([organization, finishedReportGenerator.getReportBytes()]);
            }).then(([organization, fileContent]) => {
                return { fileName: `${organization.name} - מסיימים ${date}.pdf`, content: fileContent }
            });
    }

    getReportOrganizations(date) {

        const getOrganizationsPromise = this.organizationReader.getOrganizations();

        return getOrganizationsPromise
            .then(orgs => Promise.all(orgs.map(org => new ProgramReader(org.key)
                .getFinishedPrograms(date)
                .then(progs => Object.assign({}, { org: org }, { finishedPrograms: progs }))
            )))
            .then(orgs => {

                return Promise.all(orgs
                    .filter(org => org.finishedPrograms.length)
                    .map(org => new ProjectReader(org.org.key)
                        .getProjects()
                        .then(prjs => Object.assign({}, org.org, { projects: prjs.filter(prj => org.finishedPrograms.some(prog => prog.projectKey == prj.key)) }))

                    ))
            })

    };
}