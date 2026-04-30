/**
 * @swagger
 * /api/v1/dashboard/alllocations:
 *   get:
 *     summary: Get all station locations
 *     description: Returns all metro stations with their name, line number, and coordinates sorted by line then latitude
 *     tags:
 *       - Home Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all station locations
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/dashboard/ticketanalysis:
 *   get:
 *     summary: Get ticket usage analysis
 *     description: Returns statistics about tickets usage including count, price, number of stations, and percentage of usage per ticket type
 *     tags:
 *       - Home Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ticket analysis data retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/dashboard/subscriptionanalysis:
 *   get:
 *     summary: Get subscription analysis
 *     description: Returns statistics of subscriptions grouped by category including total count and percentage distribution
 *     tags:
 *       - Home Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription analysis data retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */