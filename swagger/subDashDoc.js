/**
 * @swagger
 * tags:
 *   - name: Subscriptions (Admin)
 *     description: Manage subscription Dashboard
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions:
 *   get:
 *     summary: List all subscriptions
 *     tags: [Subscriptions (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, active, expired, canceled]
 *         description: Filter by subscription status
 *         example: pending
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 20
 *     responses:
 *       200:
 *         description: Paginated list of all subscriptions
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               total: 84
 *               page: 1
 *               pages: 5
 *               data:
 *                 - _id: "664a1b2c3d4e5f6a7b8c9d0e"
 *                   user:
 *                     _id: "663f0a1b2c3d4e5f6a7b8c9d"
 *                     name: "Ahmed Hassan"
 *                     email: "ahmed@example.com"
 *                     phone: "01012345678"
 *                   type:
 *                     _id: "663e1a2b3c4d5e6f7a8b9c0d"
 *                     category:
 *                       en: students
 *                       ar: طلاب
 *                     duration:
 *                       en: monthly
 *                       ar: شهري
 *                     zones: 2
 *                   office:
 *                     _id: "663c9a8b7f6e5d4c3b2a1f0e"
 *                     officeName:
 *                       en: cairo station office
 *                       ar: مكتب محطة القاهرة
 *                   status: pending
 *                   priceSnapshot: 250
 *                   start_date: "2024-06-01T00:00:00.000Z"
 *                   end_date: "2024-07-01T00:00:00.000Z"
 *                   createdAt: "2024-06-01T10:30:00.000Z"
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Not authorized, token missing or invalid"
 *       403:
 *         description: Forbidden — admin role required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Access denied. Admins only."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error."
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/{id}/status:
 *   patch:
 *     summary: Update a subscription's status
 *     tags: [Subscriptions (Admin)]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Updates the status of a subscription.
 *       Allowed statuses are defined on the backend (VALID_STATUSES).
 *       Optionally includes a rejection reason when status is "rejected".
 *
 *       Example flows:
 *       - pending → accepted
 *       - accepted → active
 *       - active → expired
 *       - pending → rejected (with rejectionReason)
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the subscription
 *         example: "664a1b2c3d4e5f6a7b8c9d0e"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status value (must match backend VALID_STATUSES)
 *                 enum: [pending, active, expired, canceled, rejected]  # adjust if needed
 *                 example: rejected
 *               rejectionReason:
 *                 type: string
 *                 description: Reason for rejection (required when status is rejected)
 *                 example: "Invalid documents provided"
 *           examples:
 *             activate:
 *               summary: Activate subscription
 *               value:
 *                 status: active
 *             reject:
 *               summary: Reject subscription with reason
 *               value:
 *                 status: rejected
 *                 rejectionReason: "Incomplete documents"
 *
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "664a1b2c3d4e5f6a7b8c9d0e"
 *                 status: "rejected"
 *                 rejectionReason: "Incomplete documents"
 *                 user: "663f0a1b2c3d4e5f6a7b8c9d"
 *                 type: "663e1a2b3c4d5e6f7a8b9c0d"
 *                 office: "663c9a8b7f6e5d4c3b2a1f0e"
 *                 updatedAt: "2024-06-02T09:00:00.000Z"
 *
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid status value."
 *
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Not authorized, token missing or invalid"
 *
 *       403:
 *         description: Forbidden — admin role required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Access denied. Admins only."
 *
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Subscription not found."
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error."
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/{id}/documents/{docType}:
 *   get:
 *     summary: Download a subscription document
 *     tags: [Subscriptions (Admin)]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Streams the requested document file directly to the client.
 *       File system paths are never exposed to clients — access is only through this endpoint.
 *       The server validates the resolved path stays within the uploads directory
 *       to block path traversal attacks.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the subscription
 *         example: "664a1b2c3d4e5f6a7b8c9d0e"
 *       - in: path
 *         name: docType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [nationalId_front, nationalId_back, universityId]
 *         description: Which document to retrieve
 *         example: nationalId_front
 *     responses:
 *       200:
 *         description: The requested file streamed as binary
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid document type
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid document type."
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Not authorized, token missing or invalid"
 *       403:
 *         description: Forbidden — admin role required or path traversal blocked
 *         content:
 *           application/json:
 *             examples:
 *               adminRequired:
 *                 summary: Not an admin
 *                 value:
 *                   success: false
 *                   message: "Access denied. Admins only."
 *               pathTraversal:
 *                 summary: Path traversal attempt blocked
 *                 value:
 *                   success: false
 *                   message: "Access denied."
 *       404:
 *         description: Subscription or file not found
 *         content:
 *           application/json:
 *             examples:
 *               subscriptionNotFound:
 *                 summary: Subscription not found
 *                 value:
 *                   success: false
 *                   message: "Subscription not found."
 *               documentNotFound:
 *                 summary: Document field is null (e.g. universityId on a non-student)
 *                 value:
 *                   success: false
 *                   message: "Document not found."
 *               fileNotFound:
 *                 summary: File missing from disk
 *                 value:
 *                   success: false
 *                   message: "File not found on server."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error."
 */