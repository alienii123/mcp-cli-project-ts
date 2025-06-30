import chalk from 'chalk';
import type { MCPClient } from '../src/mcp-client.js';

export interface GitHubRepoInfo {
  name: string;
  owner: string;
  description?: string;
  stars: number;
  language: string;
  updated: string;
}

export interface GitHubUserInfo {
  login: string;
  name?: string;
  followers: number;
  following: number;
  public_repos: number;
  location?: string;
  bio?: string;
}

export class GitHubTool {
  
  async searchRepositories(client: MCPClient, query: string, limit: number = 10): Promise<GitHubRepoInfo[]> {
    try {
      if (!client.isConnected()) {
        throw new Error('MCP client is not connected to GitHub server');
      }

      console.log(chalk.blue(`🔍 Searching repositories for: "${query}"`));
      const result = await client.callTool('search_repositories', { 
        query, 
        perPage: limit 
      });
      
      if (result && result[0]?.text) {
        const data = JSON.parse(result[0].text);
        return data.items?.map((repo: any) => ({
          name: repo.name,
          owner: repo.owner?.login || 'unknown',
          description: repo.description,
          stars: repo.stargazers_count || 0,
          language: repo.language || 'Unknown',
          updated: repo.updated_at
        })) || [];
      }
      
      return [];
    } catch (error) {
      console.error(chalk.red(`GitHub search failed: ${error}`));
      return [];
    }
  }

  async getRepositoryInfo(client: MCPClient, owner: string, repo: string): Promise<any> {
    try {
      if (!client.isConnected()) {
        throw new Error('MCP client is not connected to GitHub server');
      }

      console.log(chalk.blue(`📊 Getting info for: ${owner}/${repo}`));
      const result = await client.callTool('get_file_contents', { 
        owner, 
        repo, 
        path: 'README.md' 
      });
      
      if (result && result[0]?.text) {
        return JSON.parse(result[0].text);
      }
      
      return null;
    } catch (error) {
      console.error(chalk.red(`Failed to get repo info: ${error}`));
      return null;
    }
  }

  async searchCode(client: MCPClient, query: string, limit: number = 10): Promise<any[]> {
    try {
      if (!client.isConnected()) {
        throw new Error('MCP client is not connected to GitHub server');
      }

      console.log(chalk.blue(`🔍 Searching code for: "${query}"`));
      const result = await client.callTool('search_code', { 
        q: query,
        per_page: limit 
      });
      
      if (result && result[0]?.text) {
        const data = JSON.parse(result[0].text);
        return data.items || [];
      }
      
      return [];
    } catch (error) {
      console.error(chalk.red(`Code search failed: ${error}`));
      return [];
    }
  }

  async searchUsers(client: MCPClient, query: string, limit: number = 10): Promise<GitHubUserInfo[]> {
    try {
      if (!client.isConnected()) {
        throw new Error('MCP client is not connected to GitHub server');
      }

      console.log(chalk.blue(`👥 Searching users for: "${query}"`));
      const result = await client.callTool('search_users', { 
        q: query,
        per_page: limit 
      });
      
      if (result && result[0]?.text) {
        const data = JSON.parse(result[0].text);
        return data.items?.map((user: any) => ({
          login: user.login,
          name: user.name,
          followers: user.followers_count || 0,
          following: user.following_count || 0,
          public_repos: user.public_repos_count || 0,
          location: user.location,
          bio: user.bio
        })) || [];
      }
      
      return [];
    } catch (error) {
      console.error(chalk.red(`User search failed: ${error}`));
      return [];
    }
  }

  async trendingAnalysis(client: MCPClient, language?: string): Promise<void> {
    console.log(chalk.cyan('\n🚀 === TRENDING ANALYSIS EXPERIMENT === 🚀\n'));
    
    try {
      // Search for trending repositories
      const trendingQuery = language ? 
        `language:${language} created:>2024-01-01` : 
        'created:>2024-01-01 stars:>100';
      
      const repos = await this.searchRepositories(client, trendingQuery, 15);
      
      if (repos.length === 0) {
        console.log(chalk.yellow('No trending repositories found.'));
        return;
      }

      // Analyze languages
      const languageStats: Record<string, number> = {};
      repos.forEach(repo => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      // Display trending repos
      console.log(chalk.green('📈 Top Trending Repositories:'));
      repos.slice(0, 10).forEach((repo, index) => {
        console.log(chalk.white(`  ${index + 1}. ${chalk.bold(repo.owner + '/' + repo.name)}`));
        console.log(chalk.gray(`     ⭐ ${repo.stars} stars | 💻 ${repo.language || 'Unknown'}`));
        if (repo.description) {
          console.log(chalk.gray(`     📝 ${repo.description.slice(0, 80)}${repo.description.length > 80 ? '...' : ''}`));
        }
        console.log();
      });

      // Display language distribution
      console.log(chalk.green('🔥 Language Distribution:'));
      Object.entries(languageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .forEach(([lang, count]) => {
          const percentage = ((count / repos.length) * 100).toFixed(1);
          console.log(chalk.cyan(`  ${lang}: ${count} repos (${percentage}%)`));
        });

    } catch (error) {
      console.error(chalk.red(`Trending analysis failed: ${error}`));
    }
  }

  async developerInsights(client: MCPClient, username: string): Promise<void> {
    console.log(chalk.cyan(`\n👨‍💻 === DEVELOPER INSIGHTS: ${username} === 👨‍💻\n`));
    
    try {
      // Search for user's repositories
      const userRepos = await this.searchRepositories(client, `user:${username}`, 20);
      
      if (userRepos.length === 0) {
        console.log(chalk.yellow(`No public repositories found for user: ${username}`));
        return;
      }

      // Analyze programming languages
      const languageStats: Record<string, number> = {};
      userRepos.forEach(repo => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      // Calculate total stars
      const totalStars = userRepos.reduce((sum, repo) => sum + repo.stars, 0);
      const avgStars = totalStars / userRepos.length;

      // Display insights
      console.log(chalk.green('📊 Repository Statistics:'));
      console.log(chalk.white(`  📁 Total Repositories: ${userRepos.length}`));
      console.log(chalk.white(`  ⭐ Total Stars: ${totalStars}`));
      console.log(chalk.white(`  📈 Average Stars per Repo: ${avgStars.toFixed(1)}`));
      console.log();

      console.log(chalk.green('💻 Programming Languages:'));
      Object.entries(languageStats)
        .sort(([,a], [,b]) => b - a)
        .forEach(([lang, count]) => {
          const percentage = ((count / userRepos.length) * 100).toFixed(1);
          console.log(chalk.cyan(`  ${lang}: ${count} repos (${percentage}%)`));
        });
      console.log();

      console.log(chalk.green('⭐ Top Starred Repositories:'));
      userRepos
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 5)
        .forEach((repo, index) => {
          console.log(chalk.white(`  ${index + 1}. ${chalk.bold(repo.name)}`));
          console.log(chalk.gray(`     ⭐ ${repo.stars} stars | 💻 ${repo.language || 'Unknown'}`));
          if (repo.description) {
            console.log(chalk.gray(`     📝 ${repo.description.slice(0, 80)}${repo.description.length > 80 ? '...' : ''}`));
          }
          console.log();
        });

    } catch (error) {
      console.error(chalk.red(`Developer insights failed: ${error}`));
    }
  }

  async codePatternAnalysis(client: MCPClient, pattern: string, language?: string): Promise<void> {
    console.log(chalk.cyan(`\n🔍 === CODE PATTERN ANALYSIS: "${pattern}" === 🔍\n`));
    
    try {
      // Build search query
      let searchQuery = pattern;
      if (language) {
        searchQuery += ` language:${language}`;
      }
      
      const codeResults = await this.searchCode(client, searchQuery, 20);
      
      if (codeResults.length === 0) {
        console.log(chalk.yellow(`No code found matching pattern: "${pattern}"`));
        return;
      }

      // Analyze repositories
      const repoStats: Record<string, number> = {};
      const languageStats: Record<string, number> = {};
      const ownerStats: Record<string, number> = {};

      codeResults.forEach(result => {
        const repo = result.repository?.full_name;
        const lang = result.repository?.language;
        const owner = result.repository?.owner?.login;

        if (repo) repoStats[repo] = (repoStats[repo] || 0) + 1;
        if (lang) languageStats[lang] = (languageStats[lang] || 0) + 1;
        if (owner) ownerStats[owner] = (ownerStats[owner] || 0) + 1;
      });

      console.log(chalk.green('📊 Pattern Usage Statistics:'));
      console.log(chalk.white(`  📄 Files Found: ${codeResults.length}`));
      console.log(chalk.white(`  📁 Unique Repositories: ${Object.keys(repoStats).length}`));
      console.log(chalk.white(`  👥 Unique Authors: ${Object.keys(ownerStats).length}`));
      console.log();

      console.log(chalk.green('💻 Language Distribution:'));
      Object.entries(languageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .forEach(([lang, count]) => {
          const percentage = ((count / codeResults.length) * 100).toFixed(1);
          console.log(chalk.cyan(`  ${lang}: ${count} occurrences (${percentage}%)`));
        });
      console.log();

      console.log(chalk.green('🏆 Top Repositories Using This Pattern:'));
      Object.entries(repoStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([repo, count], index) => {
          console.log(chalk.white(`  ${index + 1}. ${chalk.bold(repo)} (${count} occurrences)`));
        });
      console.log();

      console.log(chalk.green('📝 Sample Code Snippets:'));
      codeResults.slice(0, 3).forEach((result, index) => {
        console.log(chalk.white(`  ${index + 1}. ${chalk.bold(result.repository?.full_name)}/${result.name}`));
        console.log(chalk.gray(`     ${result.html_url}`));
        console.log();
      });

    } catch (error) {
      console.error(chalk.red(`Code pattern analysis failed: ${error}`));
    }
  }

  async communityExplorer(client: MCPClient, topic: string): Promise<void> {
    console.log(chalk.cyan(`\n🌐 === COMMUNITY EXPLORER: "${topic}" === 🌐\n`));
    
    try {
      // Search repositories and users related to the topic
      const [repos, users] = await Promise.all([
        this.searchRepositories(client, topic, 15),
        this.searchUsers(client, topic, 10)
      ]);

      console.log(chalk.green('📚 Top Repositories:'));
      repos.slice(0, 8).forEach((repo, index) => {
        console.log(chalk.white(`  ${index + 1}. ${chalk.bold(repo.owner + '/' + repo.name)}`));
        console.log(chalk.gray(`     ⭐ ${repo.stars} stars | 💻 ${repo.language || 'Unknown'}`));
        if (repo.description) {
          console.log(chalk.gray(`     📝 ${repo.description.slice(0, 80)}${repo.description.length > 80 ? '...' : ''}`));
        }
        console.log();
      });

      console.log(chalk.green('👥 Community Members:'));
      users.slice(0, 6).forEach((user, index) => {
        console.log(chalk.white(`  ${index + 1}. ${chalk.bold(user.login)}`));
        if (user.name) console.log(chalk.gray(`     Name: ${user.name}`));
        if (user.location) console.log(chalk.gray(`     📍 ${user.location}`));
        console.log(chalk.gray(`     👥 ${user.followers} followers | 📁 ${user.public_repos} repos`));
        if (user.bio) {
          console.log(chalk.gray(`     💬 ${user.bio.slice(0, 60)}${user.bio.length > 60 ? '...' : ''}`));
        }
        console.log();
      });

      // Language analysis
      const languageStats: Record<string, number> = {};
      repos.forEach(repo => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      console.log(chalk.green('🔧 Popular Technologies:'));
      Object.entries(languageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .forEach(([lang, count]) => {
          const percentage = ((count / repos.length) * 100).toFixed(1);
          console.log(chalk.cyan(`  ${lang}: ${count} projects (${percentage}%)`));
        });

    } catch (error) {
      console.error(chalk.red(`Community exploration failed: ${error}`));
    }
  }

  async testGitHubConnection(client: MCPClient): Promise<string[]> {
    const results: string[] = [];
    
    try {
      await client.connectToGitHubServer();
      const tools = await client.listTools();
      results.push(`✅ GitHub server connected with ${tools.length} tools`);
      
      // List some available tools
      results.push('🛠️ Available GitHub tools:');
      tools.slice(0, 8).forEach(tool => {
        results.push(`   • ${tool.name}: ${tool.description || 'No description'}`);
      });
      
      // Test a simple search
      try {
        const testResult = await client.callTool('search_repositories', { 
          query: 'javascript', 
          perPage: 3 
        });
        results.push('✅ GitHub API test successful');
      } catch (error) {
        results.push(`⚠️ GitHub API test failed: ${error}`);
      }
      
    } catch (error) {
      results.push(`❌ GitHub server connection failed: ${error}`);
    }
    
    return results;
  }
} 