/**
 * @swagger
 * tags:
 *   name: Subscription Types
 *   description: Manage subscription types
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/allsubscriptionstypes:
 *   get:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscription types
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: "j12545484kk"
 *                   zones: 1
 *                   category:
 *                     en: military
 *                   duration:
 *                     en: monthly
 *                   prices: 240
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No subscription types found
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/createnewsubscriptionstype:
 *   post:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [zones, category, duration, prices]
 *             properties:
 *               zones:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *               category:
 *                 type: string
 *                 enum: [public, students, military, Elderly, special, special needs]
 *               duration:
 *                 type: string
 *                 enum: [monthly, quarterly, yearly]
 *               prices:
 *                 type: number
 *           example:
 *             zones: 1
 *             category: military
 *             duration: monthly
 *             prices: 240
 *     responses:
 *       201:
 *         description: Subscription type created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "j12545484kk"
 *                 zones: 1
 *                 category:
 *                   en: military
 *                 duration:
 *                   en: monthly
 *                 prices: 240
 *       400:
 *         description: Missing fields or already exists
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/updatesubscriptionstype/{id}:
 *   patch:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zones:
 *                 type: integer
 *               category:
 *                 type: string
 *               duration:
 *                 type: string
 *               prices:
 *                 type: number
 *           example:
 *             zones: 2
 *             category: public
 *             duration: quarterly
 *             prices: 300
 *     responses:
 *       200:
 *         description: Subscription type updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: ""
 *                 zones: 2
 *                 category:
 *                   en: public
 *                 duration:
 *                   en: quarterly
 *                 prices: 300
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription type not found
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/deletesubscriptionstype/{id}:
 *   delete:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: j12545484kk
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription type not found
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/subscriptiontype/{id}:
 *   get:
 *     tags: [Subscription Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: j12545484kk
 *     responses:
 *       200:
 *         description: return subscroption type data successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription type not found
 */

/**
 * @swagger
 * /api/v1/dashboard/subscriptions/getPending:
 *   get:
 *     summary: Get all pending subscriptions
 *     tags: [Subscriptions Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending subscriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "69f2b1983b26c03bd5fbc0cf"
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Rahma Naser"
 *                           email:
 *                             type: string
 *                             example: "rahma@email.com"
 *                           phone:
 *                             type: string
 *                             example: "01000000000"
 *                       type:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "special needs"
 *                           duration:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "3 months"
 *                           zones:
 *                             type: number
 *                             example: 2
 *                       office:
 *                         type: object
 *                         properties:
 *                           officeName:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "Nasr City Office"
 *                       start_station:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "Helwan"
 *                       end_station:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "Sadat"
 *       401:
 *         description: Unauthorized (admin not logged in)
 *       500:
 *         description: Internal server error
 */