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
 *       403:
 *         description: Forbidden — admin role required
 *       500:
 *         description: Internal server error
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
 *       Manually transitions a subscription's status.
 *       Typical flow: `pending` → `active` (after document review) → `expired` or `rejected`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the subscription
 *         example: "664a1b2c3d4e5f6a7b8c9d0e"
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
 *                 enum: [pending, active, expired, rejected]
 *                 example: active
 *               rejectionReason:
 *                 type: string
 *                 description: Required when status is rejected
 *                 example: "Invalid documents"
 *           example:
 *             status: active
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — admin role required
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Internal server error
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
 *         example: "664a1b2c3d4e5f6a7b8c9d0e"
 *       - in: path
 *         name: docType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [nationalId_front, nationalId_back, universityId]
 *         example: nationalId_front
 *     responses:
 *       200:
 *         description: The requested file streamed as binary
 *       400:
 *         description: Invalid document type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/mails:
 *   get:
 *     summary: Get all sent emails history
 *     tags: [Subscriptions (Admin)]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Returns all email logs including success and failed attempts.
 *     responses:
 *       200:
 *         description: Email history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No mails found
 *       500:
 *         description: Internal server error
 */