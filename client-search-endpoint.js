/**
 * Client Search Endpoint - Paste this into your client router file.
 * Route: GET /client/search (or mount as router.get("/search", ...))
 *
 * Requires: pool, auth, validateBranch middlewares, BASE_DOMAIN, GET_FIRMS_BY_USERNAME helper
 */
router.get("/search", auth, validateBranch, async (req, res) => {
    try {
        const { branch_id } = req;
        const { search } = req.query;

        const searchTrimmed = typeof search === "string" ? search.trim() : "";
        if (!searchTrimmed || searchTrimmed.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Search keyword must be at least 3 characters"
            });
        }

        const searchPattern = `%${searchTrimmed}%`;
        const searchStart = `${searchTrimmed}%`;

        const query = `
            SELECT
                c.id,
                c.username,
                c.branch_id,
                c.create_date,
                c.status,
                p.profile_id,
                p.name,
                p.care_of,
                p.guardian_name,
                p.date_of_birth,
                p.gender,
                p.mobile,
                p.country_code,
                p.email,
                p.pan_number,
                p.state,
                p.district,
                p.city,
                p.village_town,
                p.address_line_1,
                p.address_line_2,
                p.pincode,
                p.image
            FROM clients c
            INNER JOIN profile p ON c.username = p.username AND p.id = (
                SELECT MAX(p2.id) FROM profile p2 WHERE p2.username = c.username
            )
            WHERE c.user_type = 'client'
                AND c.is_deleted = '0'
                AND c.branch_id = ?
                AND (
                    p.name LIKE ?
                    OR p.email LIKE ?
                    OR p.mobile LIKE ?
                    OR p.guardian_name LIKE ?
                    OR p.pan_number LIKE ?
                    OR p.state LIKE ?
                    OR p.district LIKE ?
                    OR p.city LIKE ?
                    OR p.village_town LIKE ?
                    OR p.address_line_1 LIKE ?
                    OR p.address_line_2 LIKE ?
                    OR p.pincode LIKE ?
                    OR EXISTS (
                        SELECT 1 FROM firms f
                        WHERE f.username = c.username
                            AND f.branch_id = c.branch_id
                            AND f.is_deleted = '0'
                            AND f.firm_name LIKE ?
                    )
                )
            ORDER BY
                CASE WHEN p.name LIKE ? OR p.email LIKE ? OR p.mobile LIKE ? OR p.pan_number LIKE ? THEN 0 ELSE 1 END,
                c.id DESC
        `;

        const [rows] = await pool.query(query, [
            branch_id,
            searchPattern, searchPattern, searchPattern, searchPattern, searchPattern,
            searchPattern, searchPattern, searchPattern, searchPattern, searchPattern,
            searchPattern, searchPattern, searchPattern,
            searchStart, searchStart, searchStart, searchStart
        ]);

        const transformedRows = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const transformedRow = { ...row };

            if (row.image && String(row.image).trim() !== "") {
                transformedRow.image = `${BASE_DOMAIN}/media/profile/image/${row.image}`;
            } else {
                transformedRow.image = null;
            }

            let firms = [];
            try {
                firms = await GET_FIRMS_BY_USERNAME({
                    username: transformedRow.username,
                    branch_id: branch_id
                });
            } catch (err) {
                console.warn("GET_FIRMS_BY_USERNAME failed for", transformedRow.username, err);
            }
            transformedRow.firms = firms || [];

            transformedRows.push(transformedRow);
        }

        return res.status(200).json({
            success: true,
            message: "Client search completed successfully",
            data: transformedRows
        });
    } catch (error) {
        console.error("Error in client search:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to search clients",
            error: error.message
        });
    }
});
