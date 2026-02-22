/**
 * @swagger
 * tags:
 *   - name: Tickets DashBoard
 *     description: Tickets CRUD Operations Management API
 */

/**
 * @swagger
 * /api/v1/dashboard/getalltickets:
 *   get:
 *     summary: Get all Tickets
 *     tags: [Tickets DashBoard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return all Tickets data
 *       404:
 *         description: No Tickets To Show
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/getticket/{id}:
 *   get:
 *     summary: Get Ticket data by id
 *     tags: [Tickets DashBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Return Ticket data
 *       404:
 *         description: Ticket Not Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/addticket:
 *   post:
 *     summary: Add New Ticket
 *     tags: [Tickets DashBoard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketPrice
 *               - noOfStations
 *             properties:
 *               ticketPrice:
 *                 type: number
 *                 example: 10
 *               noOfStations:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Ticket Added
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/updateticket/{id}:
 *   patch:
 *     summary: Update Ticket Data
 *     tags: [Tickets DashBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketPrice:
 *                 type: number
 *                 example: 12
 *               noOfStations:
 *                 type: number
 *                 example: 6
 *     responses:
 *       200:
 *         description: Ticket Updated
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Ticket Not Found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/dashboard/deleteticket/{id}:
 *   delete:
 *     summary: Delete Ticket by id
 *     tags: [Tickets DashBoard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       204:
 *         description: Ticket Deleted
 *       404:
 *         description: Ticket Not Found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */