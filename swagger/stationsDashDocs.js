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
 *     summary: Get Stations sorted by it is position in each line
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description:Return Stations data each 10 stations in a single page
 *       404:
 *         description: No Stations To Show
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/getstation/:id:
 *   get:
 *     summary: Get Station data by id 
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description:Return Station data
 *       404:
 *         description:Station Not Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/addstation:
 *   post:
 *     summary: Add New Stataion
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
 *               - station name
 *               - line number of station
 *               - station position
 *               - is_transfer
 *               - transfer_to
 *             properties:
 *               station name:
 *                 type: string
 *               linenumber :
 *                 type: number
 *               station position:
 *                 type: number
 *               is_transfer :
 *                 type: boolean
 *               transfer_to:
 *                 type: boolean
 *     responses:
 *       201:
 *         description:Station Added 
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/updatestation/:id:
 *   patch:
 *     summary: Update Stataion Data
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
 *               - station name
 *               - line number of station
 *               - station position
 *               - is_transfer
 *               - transfer_to
 *             properties:
 *               station name:
 *                 type: string
 *               linenumber :
 *                 type: number
 *               station position:
 *                 type: number
 *               is_transfer :
 *                 type: boolean
 *               transfer_to:
 *                 type: boolean
 *     responses:
 *       201:
 *         description:Station Updated  
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description:Station Not Found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/deletestation/:id:
 *   delete:
 *     summary: delete Station data by id 
 *     tags: [Stations DashBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description:station delete
 *       404:
 *         description:Station Not Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */