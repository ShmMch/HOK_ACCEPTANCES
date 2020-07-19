
import nodemailer from 'nodemailer';

import CollectionReportGenerator from '../core/collectionReportGenerator'
import OrganizationReader from '../../dataAccess/organizationReader';
import FeeReader from '../../dataAccess/feeReader';
import ProjectReader from '../../dataAccess/projectReader';

export default class CollectionReportService {
    constructor() {
        this.feeReader = new FeeReader();
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
                    subject: `דוח גביה ליום ${date}`,
                    body: 'mail content...',
                    attachments: [{ filename: file.fileName, content: file.content }]
                });
            })

    }

    getReportFile(organizationKey, date) {
        return this.organizationReader.getOrganization(organizationKey)
            .then(organization => this.feeReader.getCompanyFee(organization.code, date).then(fee => {
                const collectionReportGenerator = new CollectionReportGenerator(organization, date, fee.dollarRate);
                return Promise.all([organization, collectionReportGenerator.getReportBytes()]); 
            })).then(([organization, fileContent]) => {
                return { fileName: `${organization.name} - גביה ${date}.pdf`, content: fileContent }     
            });           
    }

    getReportOrganizations(date) {
        const getFeesPromise = this.feeReader.getFees(date);
        const getOrganizationsPromise = this.organizationReader.getOrganizations();

        return Promise.all([getFeesPromise, getOrganizationsPromise])
            .then(([fees, organizations]) => {
                const feeCodes = fees.map(fee => fee.organizationCode);
                return organizations.filter(org => feeCodes.includes(org.code))
            })
            .then(orgs => {
                return Promise.all(orgs.map(org => new ProjectReader(org.key)
                    .getProjects()
                    .then(prjs => Object.assign({}, org, { projects: prjs }))

                ))
            })


    };
}