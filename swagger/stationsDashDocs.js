/**
 * @swagger
 * tags:
 *   - name: Stations DashBoard
 *     description: Stations CRUD Operations Management API
 */

/**
 * @swagger
 * /api/v1/dashboard/getallstations:
 *   get:
 *     summary: Get Stations sorted by position in each line
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Return Stations data each 10 stations in a single page
 *       404:
 *         description: No Stations To Show
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/getstation/{id}:
 *   get:
 *     summary: Get Station data by id
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     responses:
 *       200:
 *         description: Return Station data
 *       404:
 *         description: Station Not Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/addstation:
 *   post:
 *     summary: Add New Station
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stationName
 *               - lineNumber
 *               - position
 *             properties:
 *               stationName:
 *                 type: string
 *                 example: ain shams university
 *               lineNumber:
 *                 type: number
 *                 example: 1
 *               position:
 *                 type: number
 *                 example: 35
 *               isTransfer:
 *                 type: boolean
 *                 example: false
 *               transferTo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     line:
 *                       type: number
 *                     position:
 *                       type: number
 *     responses:
 *       201:
 *         description: Station Added
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/updatestation/{id}:
 *   patch:
 *     summary: Update Station Data
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stationName:
 *                 type: string
 *                 example: ain shams university
 *               lineNumber:
 *                 type: number
 *                 example: 1
 *               position:
 *                 type: number
 *                 example: 36
 *               isTransfer:
 *                 type: boolean
 *                 example: false
 *               transferTo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     line:
 *                       type: number
 *                     position:
 *                       type: number
 *     responses:
 *       200:
 *         description: Station Updated
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Station Not Found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/deletestation/{id}:
 *   delete:
 *     summary: Delete Station by id
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     responses:
 *       204:
 *         description: Station Deleted
 *       404:
 *         description: Station Not Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */