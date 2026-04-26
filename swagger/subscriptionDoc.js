/**
 * @swagger
 * tags:
 *   - name: Subscriptions (User)
 *     description: Manage subscription 
 */

/**
 * @swagger
 * /api/v1/subscription/plans:
 *   get:
 *     summary: Get all unique subscription categories
 *     tags: [Subscriptions (User)]
 *     description: |
 *       Returns a list of all unique subscription categories (English + Arabic structure).
 *       Used to display available subscription groups before selecting a plan.
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 numOfRecords:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       en:
 *                         type: string
 *                         example: students
 *                       ar:
 *                         type: string
 *                         example: طلاب
 *       404:
 *         description: No categories found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subscription/plans/{category}:
 *   get:
 *     summary: Get subscription plans by category
 *     tags: [Subscriptions (User)]
 *     description: |
 *       Returns all subscription plans for a specific category (supports English and Arabic input).
 *       Each response contains category info and available plans (duration, zones, price).
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name in English or Arabic
 *         example: students
 *     responses:
 *       200:
 *         description: Category plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 numOfRecords:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: students
 *                         ar:
 *                           type: string
 *                           example: طلاب
 *                     plans:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           duration:
 *                             type: string
 *                             example: monthly
 *                           zones:
 *                             type: number
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 100
 *       404:
 *         description: No plans found for this category
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subscription/create:
 *   post:
 *     summary: Submit a new subscription application
 *     tags: [Subscriptions (User)]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Creates a new subscription in `pending` status.
 *       
 *       File rules:
 *       - nationalId_front and nationalId_back are required
 *       - universityId is required for students only
 *       - Allowed formats: jpg, jpeg, pdf (max 5MB)
 *
 *       Business rules:
 *       - User cannot have active subscription
 *       - Only one of `zones` or `numOfLines` must be provided
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - duration
 *               - office
 *               - start_station
 *               - end_station
 *               - nationalId_front
 *               - nationalId_back
 *             properties:
 *               category: 
 *                 type: string
 *                 enum: ["students", "طلاب", "military", "عام"]
 *
 *               duration:
 *                 type: string
 *                 enum: ["monthly", "شهري", "yearly", "سنوي"]
 *
 *               numOfLines:
 *                 type: number
 *                 example: 9
 *                 description: Use instead of zones (only one allowed)
 *
 *               zones:
 *                 type: number
 *                 example: 2
 *                 description: Use instead of numOfLines (only one allowed)
 *
 *               office:
 *                 type: string
 *                 enum: ["el-zahraa", "الزهراء"]
 *
 *               start_station:
 *                 type: string
 *                 example: "adly mansour"
 *
 *               end_station:
 *                 type: string
 *                 example: "abbassiya"
 *
 *               nationalId_front:
 *                 type: string
 *                 format: binary
 *                 description: Front of national ID (jpg/jpeg/pdf, max 5MB)
 *
 *               nationalId_back:
 *                 type: string
 *                 format: binary
 *                 description: Back of national ID (jpg/jpeg/pdf, max 5MB)
 *
 *               universityId:
 *                 type: string
 *                 format: binary
 *                 description: Required for student subscriptions (jpg/jpeg/pdf, max 5MB)
 * 
 *               militaryId:
 *                 type: string
 *                 format: binary
 *                 description: Required for military subscriptions (jpg/jpeg/pdf, max 5MB)
 *
 *             oneOf:
 *               - required: [zones]
 *                 not:
 *                   required: [numOfLines]
 *
 *               - required: [numOfLines]
 *                 not:
 *                   required: [zones]
 *
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User already has active subscription
 */

/**
 * @swagger
 * /api/v1/subscription/me:
 *   get:
 *     summary: Get my latest subscription
 *     tags: [Subscriptions (User)]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Returns the authenticated user's most recent subscription (sorted by `createdAt` descending).
 *       Document file paths are stripped from the response for security — files are only
 *       accessible via the admin document endpoint.
 *     responses:
 *       200:
 *         description: Latest subscription
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No subscription found
 *       500:
 *         description: Internal server error
 */

