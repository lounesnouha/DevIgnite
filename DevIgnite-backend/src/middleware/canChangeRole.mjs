export const canChangeRole = (req, res, next)=>{
    const { role } = req.user;

    if (role !== "president" && role !==  "vice_president")
        return res.status(403).json({msg: "Only president and vice president can change roles"});

    next();
}