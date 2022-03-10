import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const buildGameBucket = (context: Stack) => {
    return new Bucket(context, 'AppBucket', {
        bucketName: 'cdkacha-bucket',
        websiteIndexDocument: 'index.html',
        publicReadAccess: true,
        removalPolicy: RemovalPolicy.DESTROY,
    });
};

export default buildGameBucket;
