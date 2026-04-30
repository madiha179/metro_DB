/**
 * @swagger
 * /api/v1/brt/allstations:
 *   get:
 *     summary: Get all BRT stations
 *     tags: [BRT]
 *     responses:
 *       200:
 *         description: Return all BRT stations sorted by position
 *       400:
 *         description: Stations not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/brt/route:
 *   post:
 *     summary: Get route between two BRT stations
 *     tags: [BRT]
 *     parameters:
 *       - in: query
 *         name: startStation
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the start station
 *       - in: query
 *         name: endStation
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the end station
 *     responses:
 *       200:
 *         description: Return route details between two stations
 *       400:
 *         description: Missing stations or same station selected
 *       404:
 *         description: One or both stations not found
 *       500:
 *         description: Server error
 */