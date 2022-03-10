import { SecretValue, Stack } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import {
    CodeBuildAction,
    GitHubSourceAction,
    GitHubTrigger,
    S3DeployAction,
} from 'aws-cdk-lib/aws-codepipeline-actions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { config } from 'dotenv';

interface PipelineParams {
    restApi: RestApi;
    targetBucket: Bucket;
}

const buildDeployPipeline = (context: Stack, params: PipelineParams) => {
    config();
    const TOKEN = SecretValue.plainText(process.env.GITHUB_OAUTH_TOKEN as string);

    const githubOutput = new Artifact();
    const cdkBuildOutput = new Artifact();

    return new Pipeline(context, 'Pipeline', {
        stages: [
            {
                stageName: 'Source',
                actions: [
                    new GitHubSourceAction({
                        actionName: 'GetGHRepo',
                        owner: 'NichoBrando',
                        repo: 'CDKacha',
                        branch: 'main',
                        output: githubOutput,
                        trigger: GitHubTrigger.WEBHOOK,
                        oauthToken: TOKEN,
                    }),
                ],
            },
            {
                stageName: 'Build',
                actions: [
                    new CodeBuildAction({
                        actionName: 'BuildReactApp',
                        input: githubOutput,
                        environmentVariables: {
                            REACT_APP_BACKEND_URL: {
                                value: params.restApi.url,
                            },
                        },
                        project: new PipelineProject(context, 'React App Build', {
                            environment: {
                                buildImage: LinuxBuildImage.STANDARD_5_0,
                            },
                            buildSpec: BuildSpec.fromObject({
                                version: '0.2',
                                phases: {
                                    install: {
                                        'runtime-versions': {
                                            nodejs: '14.x',
                                        },
                                    },
                                    pre_build: {
                                        commands: ['cd web && npm install'],
                                    },
                                    build: {
                                        commands: ['npm run build'],
                                    },
                                },
                                artifacts: {
                                    'base-directory': 'web/build',
                                    files: '**/*',
                                },
                            }),
                        }),
                        outputs: [cdkBuildOutput],
                    }),
                ],
            },
            {
                stageName: 'Deploy',
                actions: [
                    new S3DeployAction({
                        actionName: 'S3_Deploy',
                        bucket: params.targetBucket,
                        input: cdkBuildOutput,
                    }),
                ],
            },
        ],
    });
};

export default buildDeployPipeline;
