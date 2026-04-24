/**
 * @swagger
 * tags:
 *   - name: Subscriptions (User)
 *     description: Manage subscription 
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