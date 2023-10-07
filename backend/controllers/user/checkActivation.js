import db from "../../config/database.js"

export const checkActivation = (req, res) => {
    const staff_id = req.body.staff_id;
    console.log("bodyyyy", staff_id)
    db.query(`SELECT is_active from staff WHERE id = ${staff_id}`, 
    (err, results) => {
        if(err) {
            (err, null);
        } else {
            console.log("status::", results[0].is_active)
            if (results[0].is_active == 1) {
                res.json({ status: "AUthorized"})
            } else {
                console.log("success")
                res.json({ error: "Not Authorized" });
            }
        }
    }
    )
}   