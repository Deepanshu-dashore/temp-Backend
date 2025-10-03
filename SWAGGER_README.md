# Swagger API Documentation Setup

## Overview
This project uses Swagger UI for API documentation. The documentation is automatically generated from JSDoc comments in your route files.

## Accessing Documentation
Once the server is running, you can access the API documentation at:
```
http://localhost:5000/api-docs
```

## How to Add API Documentation

### 1. Add JSDoc Comments to Route Files
Add JSDoc comments above your route handlers using the `@swagger` tag:

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get("/", asyncHandler(async (req, res) => {
  // Your route logic here
}));
```

### 2. Define Schemas
Schemas are defined in the `swaggerConfig.js` file under the `components.schemas` section. You can add new schemas there or reference them in your JSDoc comments.

### 3. Available Schemas
- `User`: Complete user object with all properties
- `UserInput`: Input schema for creating users

## Configuration Files

### `src/Utils/swaggerConfig.js`
- Main Swagger configuration
- Defines schemas and API options
- Sets up Swagger UI with custom styling

### `src/routes/user.routes.js`
- Example route file with JSDoc comments
- Shows how to document different HTTP methods
- Includes request/response schemas

## Features
- ✅ Automatic documentation generation from JSDoc comments
- ✅ Interactive API testing interface
- ✅ Custom styling and branding
- ✅ Schema validation and examples
- ✅ Error handling and logging

## Adding New Routes
1. Create your route file in `src/routes/`
2. Add JSDoc comments above each route handler
3. Import and use the route in `app.js`
4. The documentation will be automatically updated

## Troubleshooting
- Make sure JSDoc comments are properly formatted
- Check that route files are included in the `apis` array in `swaggerConfig.js`
- Verify that the server is running on the correct port
- Check console logs for any Swagger setup errors

## Example JSDoc Structure
```javascript
/**
 * @swagger
 * /api/endpoint:
 *   method:
 *     summary: Brief description
 *     tags: [TagName]
 *     parameters:
 *       - in: path/query/header
 *         name: paramName
 *         required: true/false
 *         schema:
 *           type: string/number/boolean
 *     requestBody:
 *       required: true/false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchemaName'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 */
```
