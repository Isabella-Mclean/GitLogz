// app/api/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { repoUrl } = await request.json();
    if (!repoUrl) {
        return NextResponse.json({ message: 'GitHub repo URL is required' }, { status: 400 });
    }

    // Extract the repo owner and name from the URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
        return NextResponse.json({ message: 'Invalid GitHub repo URL' }, { status: 400 });
    }

    const [_, owner, repo] = match;

    const SONARCLOUD_TOKEN = process.env.SONARCLOUD_TOKEN;
    const SONARCLOUD_ORG = process.env.SONARCLOUD_ORG;

    // Generate a unique project key
    const projectKey = `${owner}_${repo}`;

    try {
        // Step 1: Create the project in SonarCloud
        const createProjectResponse = await fetch('https://sonarcloud.io/api/projects/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${SONARCLOUD_TOKEN}:`).toString('base64')}`,
            },
            body: new URLSearchParams({
                organization: SONARCLOUD_ORG,
                name: repo,
                project: projectKey,
            }),
        });

        if (!createProjectResponse.ok) {
            const errorData = await createProjectResponse.json();
            return NextResponse.json({ message: `Error creating project: ${errorData.errors[0].msg}` }, { status: 500 });
        }

        // Step 2: Trigger the analysis
        const triggerAnalysisResponse = await fetch('https://sonarcloud.io/web_api/api/project_analyses/create_event?deprecated=false&section=params', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${SONARCLOUD_TOKEN}:`).toString('base64')}`,
            },
            body: new URLSearchParams({
                projectKey: projectKey,
                organization: SONARCLOUD_ORG,
                repository: `${owner}/${repo}`,
                branch: 'master', // or 'main', depending on the default branch
            }),
        });

        if (!triggerAnalysisResponse.ok) {
            const errorData = await triggerAnalysisResponse.json();
            return NextResponse.json({ message: `Error triggering analysis: ${errorData.errors[0].msg}` }, { status: 500 });
        }

        // Step 3: Poll for analysis completion
        let analysisComplete = false;
        let attempts = 0;
        const maxAttempts = 30; // Adjust as needed
        let analysisStatus;

        while (!analysisComplete && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds between checks

            const statusResponse = await fetch(`https://sonarcloud.io/api/qualitygates/project_status?projectKey=${projectKey}`, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${SONARCLOUD_TOKEN}:`).toString('base64')}`,
                },
            });

            if (statusResponse.ok) {
                analysisStatus = await statusResponse.json();
                if (analysisStatus.projectStatus.status !== 'NONE') {
                    analysisComplete = true;
                }
            }

            attempts++;
        }

        if (!analysisComplete) {
            return NextResponse.json({ message: 'Analysis timed out. Please check SonarCloud manually.' });
        }

        // Return the analysis results
        return NextResponse.json({
            message: 'Analysis complete',
            status: analysisStatus.projectStatus.status,
            conditions: analysisStatus.projectStatus.conditions,
            projectUrl: `https://sonarcloud.io/dashboard?id=${projectKey}`
        });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}