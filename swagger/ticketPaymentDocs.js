/**
 * @swagger
 * tags:
 *   - name: Ticket Payment
 *     description: Ticket Payment Management API
 */

/**
 * @swagger
 * /api/v1/ticketpay/ticketpaymentkey:
 *   post:
 *     summary: Generate a payment key for a ticket
 *     tags: [Ticket Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - paymentmethod
 *             properties:
 *               ticketId:
 *                 type: string
 *                 example: 12458886
 *               paymentmethod:
 *                 type: string
 *                 example: fawry
 *     responses:
 *       200:
 *         description: Payment key created successfully
 *       400:
 *         description: Payment failed
 *       404:
 *         description: Ticket or user not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/ticketpay/ticketfawrypayment/{paymentkey}:
 *   post:
 *     summary: Make a Fawry payment using the payment key
 *     tags: [Ticket Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentkey
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment key generated from ticketpaymentkey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentmethod
 *             properties:
 *               paymentmethod:
 *                 type: string
 *                 example: fawry
 *     responses:
 *       200:
 *         description: Fawry bill reference returned successfully
 *       400:
 *         description: Payment failed or invalid payment method
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/ticketpay/ticketvisapayment/{paymentkey}:
 *   post:
 *     summary: Make a Visa Card payment using the payment key
 *     tags: [Ticket Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentkey
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment key generated from ticketpaymentkey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentmethod
 *             properties:
 *               paymentmethod:
 *                 type: string
 *                 example: visa card
 *     responses:
 *       200:
 *         description: Visa card iframe URL returned successfully
 *       400:
 *         description: Payment failed or invalid payment method
 *       500:
 *         description: Server error
 */
