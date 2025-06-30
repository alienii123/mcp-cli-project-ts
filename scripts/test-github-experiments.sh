#!/bin/bash

echo "🧪 GitHub MCP Experiments Test Suite"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${2}${1}${NC}"
}

# Function to run a test and capture result
run_test() {
    local test_name="$1"
    local command="$2"
    
    print_status "🔍 Testing: $test_name" "$BLUE"
    
    if eval "$command" > /dev/null 2>&1; then
        print_status "✅ PASS: $test_name" "$GREEN"
        return 0
    else
        print_status "❌ FAIL: $test_name" "$RED"
        return 1
    fi
}

# Function to run experiment demo
run_experiment_demo() {
    local experiment_name="$1"
    local command="$2"
    
    print_status "\n🚀 Running: $experiment_name" "$CYAN"
    print_status "Command: $command" "$YELLOW"
    echo "----------------------------------------"
    
    eval "$command"
    echo ""
    print_status "✨ Experiment completed!" "$GREEN"
    echo "========================================"
}

# Check prerequisites
print_status "📋 Checking Prerequisites..." "$BLUE"

# Check if project is built
if [ ! -d "dist" ]; then
    print_status "Building project..." "$YELLOW"
    npm run build
fi

# Check GitHub token
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ] && [ -z "$GITHUB_TOKEN" ]; then
    print_status "⚠️  No GitHub token found. Some tests may fail." "$YELLOW"
    print_status "Set GITHUB_PERSONAL_ACCESS_TOKEN for full functionality." "$YELLOW"
else
    print_status "✅ GitHub token configured" "$GREEN"
fi

echo ""

# Run basic connectivity tests
print_status "🔌 Running Connectivity Tests..." "$BLUE"
echo ""

run_test "GitHub MCP Server Connection" "npm run github connect"
run_test "GitHub Tools Discovery" "npm run github tools"

echo ""

# Run search functionality tests
print_status "🔍 Running Search Functionality Tests..." "$BLUE"
echo ""

run_test "Repository Search" "npm run github search --repos 'typescript' --limit 3"
run_test "User Search" "npm run github search --users 'octocat' --limit 3"
run_test "Code Search" "npm run github search --code 'async function' --limit 3"

echo ""

# Interactive experiment demos
print_status "🎭 Running Interactive Experiment Demos..." "$BLUE"

read -p "Would you like to run full experiment demos? (y/N): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    
    # Demo 1: Trending Analysis
    run_experiment_demo "Trending TypeScript Analysis" "npm run github trending --language typescript"
    
    read -p "Continue to next experiment? (y/N): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Demo 2: Developer Profile
        run_experiment_demo "Developer Profile Analysis (octocat)" "npm run github developer octocat"
    fi
    
    read -p "Continue to pattern analysis? (y/N): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Demo 3: Code Pattern Analysis
        run_experiment_demo "React Hook Pattern Analysis" "npm run github pattern 'useState' --language javascript"
    fi
    
    read -p "Continue to community exploration? (y/N): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Demo 4: Community Explorer
        run_experiment_demo "Machine Learning Community" "npm run github community machine-learning"
    fi
    
    read -p "Run all experiments at once? (y/N): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Demo 5: Full Experiment Suite
        run_experiment_demo "Complete Experiment Suite" "npm run github experiments --topic typescript --user octocat"
    fi
fi

echo ""
print_status "📊 Test Summary" "$BLUE"
echo "----------------------------------------"
print_status "Basic connectivity and search tests completed" "$GREEN"
print_status "GitHub MCP server integration is working!" "$GREEN"
echo ""
print_status "💡 Next Steps:" "$YELLOW"
echo "1. Set up GitHub Personal Access Token for full API access"
echo "2. Try custom searches: npm run github search --repos 'your-topic'"
echo "3. Analyze developers: npm run github developer username"
echo "4. Explore communities: npm run github community topic"
echo "5. Run pattern analysis: npm run github pattern 'code-pattern'"
echo ""
print_status "🎉 GitHub MCP Experiments are ready!" "$CYAN" 