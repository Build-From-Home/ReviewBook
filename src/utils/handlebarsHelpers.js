import { basePath } from './config.js';


export const helperFunctions = {
    url: function (options) {
        return `${basePath}/${options.fn()}`;
    },
}