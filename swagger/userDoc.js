/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User Management API
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               name:
 *                 type: string
 *                 example: user1
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 example: user1234
 *               confirm_password:
 *                 type: string
 *                 example: user1234
 *               phone:
 *                 type: string
 *                 example: 01234567890
 *               age:
 *                 type: number
 *                 example: 25
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: female
 *               ssn:
 *                 type: number
 *                 example: 12345678901234
 *               photo:
 *                 type: string
 *                 example: profile.jpg
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/v1/users/forgotpassword:
 *   post:
 *     summary: Send a password reset link to user's email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/users/resetpassword/{token}:
 *   patch:
 *     summary: Reset password using token sent via email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token received in email for resetting password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirm_password
 *             properties:
 *               password:
 *                 type: string
 *                 example: newPassword123
 *               confirm_password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or passwords do not match
 *       500:
 *         description: Server error
 */