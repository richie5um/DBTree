'use strict';

let _ = require('lodash');
let Dropbox = require('dropbox');
let dbx = new Dropbox({
    accessToken: process.env.DB_ACCESS_TOKEN
});

let all = {};

let promises: Promise<any>[] = [];

let runPromises = () => {
    let _promises = promises;
    promises = [];

    if (0 === _promises.length) {
        sizes(all);
        console.dir(all, { depth: null });
    } else {
        Promise.all(_promises)
            .then(() => {
                setTimeout(runPromises, 0);
            });
    }
};

let dir = (path: string, item: any) => {
    //console.log(path);
    return dbx
        .filesListFolder({ path: path })
        .then(function (response: any) {
            item.children = _.map(response.entries, (entry: any) => {
                let slimEntry: any = {
                    type: entry['.tag'],
                    name: entry.name,
                    path: entry.path_display
                };

                if (slimEntry.type === 'file') {
                    slimEntry.size = entry.size;
                }

                return slimEntry;
            });

            _.each(item.children, (entry: any) => {
                if (entry.type === 'folder') {
                    promises.push(dir(entry.path, entry));
                }
            });
        })
        .catch(function(error: Error) {
            //console.log(error);
        });
};

let sizes = (item: any) => {
    item.size = _.reduce(item.children, (child: any, sum: number) => {
        if (item.type === 'folder') {
            sum += sizes(child);
        } else {
            sum += item.size;
        }
    }, 0);

    return item.size;
};

promises.push(dir('', all));
runPromises();
