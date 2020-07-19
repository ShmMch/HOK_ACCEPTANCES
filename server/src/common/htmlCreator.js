import Mustache from 'Mustache';
import { readAllBytes } from "./fileAsync";


const loadTemplate = templatePath => {
    return readAllBytes(templatePath, 'utf8');
}
export const createHtml = (data, templatePath) => {
 
    return loadTemplate(templatePath).then(template => {     
        return Mustache.render(template, data);
    })

};

