#!/bin/bash

echo "🐙 GitHub MCP Server Setup"
echo "=========================="
echo ""

# Check if GitHub token is already set
if [ -n "$GITHUB_PERSONAL_ACCESS_TOKEN" ] || [ -n "$GITHUB_TOKEN" ]; then
    echo "✅ GitHub token is already configured!"
    echo ""
else
    echo "⚠️  GitHub Personal Access Token not found"
    echo ""
    echo "To use the GitHub MCP server, you need a Personal Access Token:"
    echo ""
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select scopes:"
    echo "   - 'repo' for full repository access"
    echo "   - OR 'public_repo' for public repositories only"
    echo "4. Copy the generated token"
    echo ""
    echo "Then set it as an environment variable:"
    echo "   export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here"
    echo ""
    echo "Or add it to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
    echo "   echo 'export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here' >> ~/.zshrc"
    echo ""
fi

# Test GitHub MCP server availability
echo "🧪 Testing GitHub MCP server..."
echo ""

# Install the GitHub MCP server if not available
echo "📦 Installing GitHub MCP server..."
npx -y @modelcontextprotocol/server-github --help > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ GitHub MCP server is available"
else
    echo "❌ Failed to install GitHub MCP server"
    echo "   Try: npm install -g @modelcontextprotocol/server-github"
fi

echo ""
echo "🚀 Ready to run GitHub experiments!"
echo ""
echo "Quick test commands:"
echo "   npm run github connect                    # Test connection"
echo "   npm run github tools                      # List available tools"
echo "   npm run github search --repos 'typescript'  # Search repositories"
echo "   npm run github experiments               # Run all experiments"
echo "" 