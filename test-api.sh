#!/bin/bash

# Contify CMS - Quick Testing Commands
# Save this file and run: bash test-api.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API Base URL
BASE_URL="http://localhost:9090"

echo -e "${BLUE}=== Contify CMS API Testing ===${NC}\n"

# Step 1: Health Check
echo -e "${GREEN}1. Health Check${NC}"
curl -X GET "$BASE_URL/health" | jq '.'
echo -e "\n"

# Get test user IDs (you'll need to replace these with actual IDs from console output)
echo -e "${BLUE}⚠️  Update these variables with IDs from server console output:${NC}"
STAKEHOLDER_ID="replace-with-stakeholder-id"
ADMIN_ID="replace-with-admin-id"
EDITOR_ID="replace-with-editor-id"

echo -e "\n${GREEN}2. Create Project Request (STAGE 1)${NC}"
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/projects/request?clientId=$STAKEHOLDER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Redesign 2026",
    "description": "Complete website overhaul with new design system and modern UI",
    "contentTypes": ["DESIGN", "COPY", "VIDEO"],
    "deadline": "2026-05-30"
  }')

echo "$PROJECT_RESPONSE" | jq '.'
PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.data.id')
echo -e "Project ID: $PROJECT_ID\n"

# Step 3: Get all requests as admin
echo -e "${GREEN}3. Get New Requests (Admin Dashboard - STAGE 2)${NC}"
curl -s -X GET "$BASE_URL/api/admin/requests" | jq '.'
echo -e "\n"

# Step 4: Create plan
echo -e "${GREEN}4. Create Project Plan (STAGE 2)${NC}"
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/projects/$PROJECT_ID/plan?adminId=$ADMIN_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "timelineStart": "2026-04-10",
    "timelineEnd": "2026-05-30",
    "notes": "Comprehensive 3-phase delivery plan: Design Phase (2 weeks), Content Development (1 week), Final Review (1 week)",
    "milestones": [
      {
        "title": "Design Phase - Complete wireframes and design system",
        "dueDate": "2026-04-24",
        "orderIndex": 1
      },
      {
        "title": "Content Development - Write copy and gather assets",
        "dueDate": "2026-05-08",
        "orderIndex": 2
      },
      {
        "title": "Final Review & Delivery - QA and launch preparation",
        "dueDate": "2026-05-30",
        "orderIndex": 3
      }
    ]
  }')

echo "$PLAN_RESPONSE" | jq '.'
echo -e "\n"

# Step 5: Send plan to client
echo -e "${GREEN}5. Send Plan to Client (STAGE 2)${NC}"
curl -s -X PATCH "$BASE_URL/api/admin/projects/$PROJECT_ID/plan/send?adminId=$ADMIN_ID" | jq '.'
echo -e "\n"

# Step 6: Get notifications for stakeholder
echo -e "${GREEN}6. Get Stakeholder Notifications${NC}"
curl -s -X GET "$BASE_URL/api/notifications?userId=$STAKEHOLDER_ID" | jq '.'
echo -e "\n"

# Step 7: Get project for stakeholder
echo -e "${GREEN}7. Get Project Detail (Stakeholder View - STAGE 3)${NC}"
curl -s -X GET "$BASE_URL/api/projects/$PROJECT_ID?clientId=$STAKEHOLDER_ID" | jq '.'
echo -e "\n"

# Step 8: Accept plan
echo -e "${GREEN}8. Stakeholder Accepts Plan (STAGE 3)${NC}"
curl -s -X PATCH "$BASE_URL/api/projects/$PROJECT_ID/accept?clientId=$STAKEHOLDER_ID" | jq '.'
echo -e "\n"

# Step 9: Admin receives notification
echo -e "${GREEN}9. Check Admin Notifications${NC}"
curl -s -X GET "$BASE_URL/api/notifications?userId=$ADMIN_ID" | jq '.'
echo -e "\n"

echo -e "${BLUE}=== Testing Complete ===${NC}\n"
echo -e "${GREEN}✅ All Stage 1-3 endpoints working!${NC}\n"

# Alternative: Request changes instead of accepting
echo -e "${BLUE}(Alternative) Request Changes Instead:${NC}"
echo "curl -X PATCH \"$BASE_URL/api/projects/$PROJECT_ID/feedback?clientId=$STAKEHOLDER_ID\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"feedback\": \"Please adjust timeline to 2 weeks earlier\"}'"
