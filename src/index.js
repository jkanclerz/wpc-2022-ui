import {hello} from './hello';
import { awsConfig } from './env';

const myFirstActionBtn = document.querySelector('.myFirstActionBtn');
myFirstActionBtn.addEventListener('click', hello);

const listBucketsBtn = document.querySelector('.listBucketsBtn');
listBucketsBtn.addEventListener('click', () => listMyBuckets());

import { S3Client, ListObjectsV2Command} from "@aws-sdk/client-s3";

const listMyBuckets = () => {
    const s3 = new S3Client({
        region: awsConfig.region
    });
    const listObjectsParams = {
        Bucket: awsConfig.Bucket
    };
    s3.send(new ListObjectsV2Command(listObjectsParams))
        .then(files => console.log(files));
}

