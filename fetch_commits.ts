import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Import the content.json data
const content = JSON.parse(fs.readFileSync('src/content.json', 'utf-8'));

async function fetchAndSaveCommits() {
  for (const milestone of content) {
    const { owner, repo, branch } = milestone;
    const filename = `${owner}-${repo}-${branch}.json`;
    const filePath = path.join(DATA_DIR, filename);
    
    console.log(`Fetching commits for ${owner}/${repo}/${branch}...`);
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Saved ${data.length} commits to ${filePath}`);
      } else {
        console.error(`Error fetching commits: ${data.message}`);
      }
      
      // Respect GitHub's rate limits by waiting between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${owner}/${repo}/${branch}:`, error);
    }
  }
}

fetchAndSaveCommits().then(() => {
  console.log('All commits fetched and saved.');
});