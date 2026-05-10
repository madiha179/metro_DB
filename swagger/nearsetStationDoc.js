/**
 * @swagger
 * /api/v1/neareststation/{lat}/{lng}:
 *   get:
 *     summary: Get nearest station to user location
 *     description: Find the nearest metro station based on user's latitude and longitude
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: User's latitude
 *       - in: path
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude
 *     responses:
 *       200:
 *         description: Nearest station found successfully
 *       400:
 *         description: Invalid latitude or longitude provided
 *       404:
 *         description: No station found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/v1/neareststation/crowding/{lat}/{lng}:
 *   get:
 *     summary: Get station crowding level
 *     description: Get crowding color for a specific station based on user's location and station name
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: User's latitude
 *       - in: path
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude
 *       - in: query
 *         name: stationName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the station
 *     responses:
 *       200:
 *         description: Crowding level fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     color:
 *                       type: string
 *                       example: red
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: No station found
 *       500:
 *         description: Server error
 */