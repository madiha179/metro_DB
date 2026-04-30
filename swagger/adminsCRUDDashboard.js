/**
 * @swagger
 * tags:
 *   - name: Admins (Super Admin)
 *     description: Manage admins by super admin only
 */

/**
 * @swagger
 * /api/v1/admins:
 *   post:
 *     summary: Create new admin
 *     tags: [Admins (Super Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - ssn
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               ssn:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin created successfully
 *       400:
 *         description: Missing required data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all admins
 *     tags: [Admins (Super Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return all admins
 *       400:
 *         description: No data found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admins (Super Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       204:
 *         description: Admin deleted successfully
 *       400:
 *         description: Admin not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */