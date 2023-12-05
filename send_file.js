var fs = require('fs');

const url = 'http://127.0.0.1:8000/uploadfile';
const ONE_OFFSET = 102400;
const filePath = "data.zip"

const readBinaryData = (filePath) => {
    fs.open(filePath, 'r', async (err, fd) => {
        if (err) throw err;

        let offset = 0;
        let buffer = Buffer.alloc(ONE_OFFSET);

        while (true) {
            let readLength = fs.readSync(fd, buffer, 0, ONE_OFFSET, offset);
            if (readLength === 0) break;
            let resizedBuffer = buffer.slice(0, readLength)

            const base64Data = resizedBuffer.toString('base64');

            const data = {
                filename: filePath,
                offset: offset,
                content: base64Data
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'content-type': "application/json"
                    },
                    body: JSON.stringify(data)
                });
                if ( response.status === 200)
                    offset += ONE_OFFSET;
            } catch (error) {
            }
        }
    });
}

readBinaryData(filePath);
