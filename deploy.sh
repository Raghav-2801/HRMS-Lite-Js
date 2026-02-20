#!/bin/bash
# HRMS Lite - Deployment Script
# Usage: bash deploy.sh [backend|frontend|all]

DEPLOY_TYPE=${1:-all}
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 HRMS Lite Deployment Script${NC}"
echo "======================================"

# Backend Deployment
deploy_backend() {
    echo -e "\n${YELLOW}📦 Building Backend...${NC}"
    
    # Check if backend requirements are installed
    if [ ! -d "backend/venv" ]; then
        echo -e "${YELLOW}Creating virtual environment...${NC}"
        cd backend
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ..
    fi
    
    echo -e "${GREEN}✅ Backend ready for deployment on Render${NC}"
    echo "Steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Go to https://dashboard.render.com"
    echo "3. Create Web Service with:"
    echo "   - Build: pip install -r backend/requirements.txt"
    echo "   - Start: cd backend && uvicorn main:app --host 0.0.0.0 --port \$PORT"
}

# Frontend Deployment
deploy_frontend() {
    echo -e "\n${YELLOW}🎨 Building Frontend...${NC}"
    
    cd frontend
    
    # Install dependencies
    echo -e "${YELLOW}Installing npm packages...${NC}"
    npm install
    
    # Build
    echo -e "${YELLOW}Building for production...${NC}"
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend built successfully!${NC}"
        echo ""
        echo -e "${YELLOW}📤 Upload Instructions:${NC}"
        echo "Next steps:"
        echo "1. Upload contents of 'frontend/dist' to your server"
        echo "2. Path: /var/www/kapilraghav.info/HRMS/"
        echo "3. Configure your web server (nginx/apache) for SPA routing"
        echo ""
        echo "SFTP Command:"
        echo "sftp your-username@kapilraghav.info"
        echo "put -r frontend/dist/* /var/www/kapilraghav.info/HRMS/"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    
    cd ..
}

# Git Deployment
push_to_github() {
    echo -e "\n${YELLOW}📝 Pushing to GitHub...${NC}"
    
    git add .
    git commit -m "Deployment: $DEPLOY_TYPE"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Pushed to GitHub successfully!${NC}"
    else
        echo -e "${RED}❌ GitHub push failed${NC}"
        exit 1
    fi
}

# Main execution
case $DEPLOY_TYPE in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        push_to_github
        deploy_backend
        deploy_frontend
        echo -e "\n${GREEN}✅ All systems ready for deployment!${NC}"
        ;;
    *)
        echo -e "${RED}Usage: bash deploy.sh [backend|frontend|all]${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done! 🎉${NC}"
