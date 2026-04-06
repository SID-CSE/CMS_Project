# Contify CMS - Complete Setup & Testing Guide

## ✅ WHAT HAS BEEN GENERATED

### Backend Structure Created:
1. **8 Entity Classes** (JPA/Hibernate auto-create tables)
   - User, ProjectRequest, ProjectPlan, PlanMilestone
   - Task, TaskSubmission, ReferenceFile, Notification

2. **8 Repository Interfaces** (Spring Data JPA)
   - All with custom query methods for quick data access

3. **2 Service Classes**
   - ProjectService (workflow logic for Stage 1-3)
   - NotificationService (notification management)

4. **3 REST Controller Classes**
   - ProjectRequestController (stakeholder endpoints)
   - AdminProjectController (admin endpoints)
   - NotificationController (notification endpoints)

5. **6 DTO Classes**
   - CreateProjectRequestDTO, ProjectRequestResponseDTO
   - CreateProjectPlanDTO, ProjectPlanResponseDTO
   - UserSummaryDTO, RequestChangesDTO
   - ApiResponse (generic response wrapper)

6. **Supporting Classes**
   - AppConfig (CORS, ObjectMapper beans)
   - GlobalExceptionHandler (centralized error handling)
   - DataSeeder (auto-creates test users on startup)

---

## 🚀 QUICK START

### Step 1: Create Database in MySQL
```bash
# Open MySQL CLI or MySQL Workbench
mysql -u root -p

# Run this command:
CREATE DATABASE Contify;
```

### Step 2: Update Database Credentials (if needed)
File: `server/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Contify?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password_here
```

### Step 3: Start Spring Boot Server
```bash
cd server
mvn clean install
mvn spring-boot:run
```

**Expected output:**
```
Started ServerApplication in X seconds
Test users created successfully
Stakeholder ID: {uuid} (email: client@contify.com)
Admin ID: {uuid} (email: admin@contify.com)
Editor ID: {uuid} (email: editor@contify.com)
```

### Step 4: Verify Server is Running
```bash
curl http://localhost:9090/
# Expected: {"message":"Contify CMS Backend Server is running","version":"1.0.0","status":"OK"}
```

---

## 🧪 TESTING THE WORKFLOW

### Test Data to Use:
Save these from console output after server starts:
```
STAKEHOLDER_ID = {from console}
ADMIN_ID = {from console}
EDITOR_ID = {from console}
```

---

## 📋 WORKFLOW TESTING STEPS

### STAGE 1: Stakeholder Posts Project Request

**Test 1.1: Create Project Request**
```bash
curl -X POST http://localhost:9090/api/projects/request?clientId=STAKEHOLDER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Redesign",
    "description": "Complete website overhaul with new design system",
    "contentTypes": ["DESIGN", "COPY"],
    "deadline": "2026-05-30"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Project request created successfully",
  "data": {
    "id": "PROJECT_ID",
    "title": "Website Redesign",
    "status": "REQUESTED",
    "client": {...}
  }
}
```

**Save:** `PROJECT_ID` from response

---

### STAGE 2: Admin Reviews and Creates Plan

**Test 2.1: Get All New Requests (Admin Dashboard)**
```bash
curl http://localhost:9090/api/admin/requests
```

**Expected Response:** List of requests with status REQUESTED

---

**Test 2.2: Create Project Plan**
```bash
curl -X POST http://localhost:9090/api/admin/projects/PROJECT_ID/plan?adminId=ADMIN_ID \
  -H "Content-Type: application/json" \
  -d '{
    "timelineStart": "2026-04-10",
    "timelineEnd": "2026-05-30",
    "notes": "Comprehensive 3-phase delivery plan with team collaboration",
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
        "title": "Final Review & Delivery",
        "dueDate": "2026-05-30",
        "orderIndex": 3
      }
    ]
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Project plan created successfully",
  "data": {
    "id": "PLAN_ID",
    "projectId": "PROJECT_ID",
    "timelineStart": "2026-04-10",
    "timelineEnd": "2026-05-30",
    "milestones": [
      {"title": "Design Phase...", "dueDate": "2026-04-24", "orderIndex": 1},
      ...
    ]
  }
}
```

---

**Test 2.3: Send Plan to Client**
```bash
curl -X PATCH http://localhost:9090/api/admin/projects/PROJECT_ID/plan/send?adminId=ADMIN_ID
```

**Expected Response:** Plan with `sentAt` timestamp set

---

### STAGE 3: Stakeholder Accepts or Requests Changes

**Test 3.1: Get Project Detail (for Stakeholder)**
```bash
curl "http://localhost:9090/api/projects/PROJECT_ID?clientId=STAKEHOLDER_ID"
```

**Expected:** Project with status PLAN_SENT and plan details

---

**Test 3.2: Get Notification (Stakeholder notified of plan)**
```bash
curl "http://localhost:9090/api/notifications?userId=STAKEHOLDER_ID"
```

**Expected:** Notification with type: PLAN_SENT

---

**Test 3.3: Stakeholder Accepts Plan**
```bash
curl -X PATCH "http://localhost:9090/api/projects/PROJECT_ID/accept?clientId=STAKEHOLDER_ID"
```

**Expected Response:** Project status changed to `IN_PROGRESS`

---

**Alternative: Request Changes Instead**
```bash
curl -X PATCH "http://localhost:9090/api/projects/PROJECT_ID/feedback?clientId=STAKEHOLDER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Please adjust timeline to 2 weeks earlier. Need more video content emphasis."
  }'
```

**Expected:** Project stays in PLAN_SENT, feedback recorded

---

## ✅ VERIFICATION CHECKLIST

- [ ] MySQL database created: `Contify`
- [ ] Spring Boot server running on port 9090
- [ ] Test users created (check console logs)
- [ ] Project request created successfully
- [ ] Admin can see request in dashboard
- [ ] Admin can create plan with milestones
- [ ] Admin can send plan to client
- [ ] Stakeholder receives plan notification
- [ ] Stakeholder can accept plan
- [ ] Stakeholder can request changes
- [ ] Project status transitions correctly

---

## 🔄 DATABASE STATE VERIFICATION

### Check created tables in MySQL:
```sql
USE Contify;
SHOW TABLES;
DESC users;
DESC project_requests;
DESC project_plans;
DESC plan_milestones;
DESC notifications;
```

### Check test data was created:
```sql
SELECT id, email, role FROM users;
SELECT id, title, status FROM project_requests;
```

---

## 📝 LOGS TO WATCH

When running `mvn spring-boot:run`, look for these key logs:

```
✅ Started ServerApplication in X.XXX seconds
✅ Starting data seeding...
✅ Test users created successfully
✅ Stakeholder ID: {uuid} (email: client@contify.com)
✅ Admin ID: {uuid} (email: admin@contify.com)
✅ Editor ID: {uuid} (email: editor@contify.com)
```

When testing endpoints:

```
✅ POST /api/projects/request - Creating project request for client: {uuid}
✅ Project request created with id: {uuid}
✅ Notified admin {adminId} of new request: {projectId}
✅ PATCH /api/admin/projects/{projectId}/plan/send - Sending plan to client
✅ Plan sent to client for project: {projectId}
✅ Notified stakeholder {clientId} of plan sent: {planId}
```

---

## 🛠️ DEPENDENCIES INSTALLED

- Spring Boot 4.0.5
- Spring Data JPA (Hibernate)
- MySQL Connector Java 8.0.35
- Lombok
- Spring Validation
- Spring Security (for future JWT)
- Maven

---

## ⚠️ KNOWN LIMITATIONS (For Future Implementation)

✗ **Not yet implemented:**
- JWT authentication (will add @PreAuthorize for role checks)
- S3 file uploads (placeholder for file upload endpoints)
- Tasks & task assignments (Stage 4)
- Task submissions (Stage 5)
- Admin review & approval (Stage 6)
- Delivery page (Stage 7)
- WebSocket notifications (currently polling)

---

## 📞 TROUBLESHOOTING

### Issue: "Connection refused" on port 9090
**Solution:** Check if another apps is using port 9090, or change in application.properties

### Issue: "Unknown database 'Contify'"
**Solution:** Create database first: `CREATE DATABASE Contify;`

### Issue: "Access denied for user 'root'"
**Solution:** Update MySQL password in application.properties

### Issue: "Table doesn't exist"
**Solution:** Check that `spring.jpa.hibernate.ddl-auto=update` is set in application.properties

### Issue: "No test users created"
**Solution:** Check console for DataSeeder logs, verify UserRepository is working

---

## 🎯 NEXT STEPS

1. ✅ Backend Stage 1-3 complete
2. 📋 TODO: Implement Stage 4-7 endpoints (tasks, submissions, delivery)
3. 📋 TODO: Add JWT authentication
4. 📋 TODO: Add S3 file upload service
5. 📋 TODO: Create React frontend components
6. 📋 TODO: Integrate frontend with backend APIs

---

## 📚 Files Reference

Key implementation files:
- [ProjectService](src/main/java/com/example/server/service/ProjectService.java) - Main workflow logic
- [ProjectRequestController](src/main/java/com/example/server/controller/ProjectRequestController.java) - Stakeholder endpoints
- [AdminProjectController](src/main/java/com/example/server/controller/AdminProjectController.java) - Admin endpoints
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Full endpoint documentation

---

Good luck with Contify! 🚀
