import https from 'https';
import fs from 'fs';

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }

            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

const run = async () => {
    try {
        await download("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xN8EItWvB2rY-2t1M5jLdE4F2mO6Sj92aQ&s", "e:/Jewellery/frontend/public/images/rings/ring1.jpg");
        console.log("Downloaded ring1");
        await download("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJz5c0zPKh_kXjW633vB_u36_s8787hO2nA&s", "e:/Jewellery/frontend/public/images/rings/ring2.jpg");
        console.log("Downloaded ring2");
        await download("https://m.media-amazon.com/images/I/815dZJzV9AL._AC_SL1500_.jpg", "e:/Jewellery/frontend/public/images/rings/ring3.jpg");
        console.log("Downloaded ring3");
        await download("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzR-Zc88GgK_RcPq0G5A3A0q-mJt3mB9Wd6w&s", "e:/Jewellery/frontend/public/images/rings/ring4.jpg");
        console.log("Downloaded ring4");
    } catch (e) {
        console.error(e);
    }
}

run();
