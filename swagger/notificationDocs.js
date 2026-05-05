/**
 * @swagger
 *   /api/v1/notification-history:
 *   get:
 *     summary: get user's notifications history
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
*     responses:
*       200:
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 notificationId:
*                   type: String
*                 userId:
*                   type: String
*                 title:
*                   type: String
*                 message:
*                   type: String
*                 sendAt:
*                   type: Date
 *         description: return all user's notifications history
 *       400:
 *         description: user not login 
 *       500:
 *         description: Server error
 */