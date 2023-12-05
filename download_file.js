var fs = require('fs');

const urlDownloadRequest = 'http://127.0.0.1:8000/downloadrequest';
const urlDownloadFile = 'http://127.0.0.1:8000/downloadfile';
const ONE_OFFSET = 102400;

const filePath = "data.zip"

const download = async (filePath) => {
    try {
        const requestData = {
            filename: filePath
        }
        const responseRequest = await fetch(urlDownloadRequest, {
            method: 'POST',
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify(requestData)
        });
        const responseRequestData = await responseRequest.json();
        let filesize = responseRequestData.size;

        fs.open(filePath, 'w+', async (err, fd) => {
            if (err) throw err;
            let offset = 0;
            while (offset < filesize) {
                const data = {
                    filename: filePath,
                    offset: offset, 
                    length: Math.min(filesize - offset, ONE_OFFSET)
                }
                let response ;
                while ( true ) {
                    response = await fetch(urlDownloadFile, {
                        method: 'POST',
                        headers: {
                            'content-type': "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                    if ( response.status ===200 ) break;
                }

                const responseData = await response.json();
                const content = responseData.content;

                // console.log(content);

                const buffer = Buffer.from(content, 'base64');
                // const buffer = atob(content);
                // console.log(buffer.length);

                // await fs.writeSync(fd, buffer, 0, buffer.length, offset);
                await fs.appendFileSync(filePath, buffer)

                offset += ONE_OFFSET;
            }

        });
    } catch (error) {
        console.log(error)
    }
}

download(filePath);
