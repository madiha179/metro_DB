/**
 * @swagger
 * /api/v1/trips/station:
 *   get:
 *     summary: Return all stations
 *     tags: [Stations]
 *     responses:
 *       200:
 *         description: Return station list
 *       400:
 *         description: Error retrieving stations
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/trips/info:
 *   post:
 *     summary: Return station list, number of stations, distance, time, and ticket price
 *     tags: [Stations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startStation
 *               - endStation
 *             properties:
 *               startStation:
 *                 type: string
 *                 example: "Helwan"
 *               endStation:
 *                 type: string
 *                 example: "Maadi"
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: No transfer station found OR invalid station name
 *       500:
 *         description: Server error
 */
